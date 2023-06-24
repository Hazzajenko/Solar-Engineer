using ApplicationCore.Extensions;
using Infrastructure.Extensions;
using Mediator;
using Messages.Application.Data.UnitOfWork;
using Messages.Contracts.Responses;
using Messages.SignalR.Commands.GroupChats;
using Messages.SignalR.Hubs;
using Microsoft.AspNetCore.SignalR;

namespace Messages.Application.Handlers.GroupChats;

public class RemoveUsersFromGroupChatHandler : IQueryHandler<RemoveUsersFromGroupChatCommand, bool>
{
    private readonly IHubContext<MessagesHub, IMessagesHub> _hubContext;
    private readonly ILogger<RemoveUsersFromGroupChatHandler> _logger;
    private readonly IMessagesUnitOfWork _unitOfWork;

    public RemoveUsersFromGroupChatHandler(
        ILogger<RemoveUsersFromGroupChatHandler> logger,
        IMessagesUnitOfWork unitOfWork,
        IHubContext<MessagesHub, IMessagesHub> hubContext
    )
    {
        _logger = logger;
        _unitOfWork = unitOfWork;
        _hubContext = hubContext;
    }

    public async ValueTask<bool> Handle(
        RemoveUsersFromGroupChatCommand command,
        CancellationToken cT
    )
    {
        var appUserId = command.AuthUser.Id;
        var groupChatId = command.RemoveRequest.GroupChatId.ToGuid();

        var appUserGroupChat =
            await _unitOfWork.AppUserGroupChatsRepository.GetByAppUserAndGroupChatIdAsync(
                appUserId,
                groupChatId
            );
        if (appUserGroupChat is null)
        {
            _logger.LogError("Bad request, appUserGroupChat is invalid");
            throw new HubException("User is not apart of this group chat");
        }

        if (appUserGroupChat.CanKick is false)
        {
            _logger.LogError("Bad request, User {User} does not have kick permissions", appUserId);
            throw new HubException("User does not have kick permissions");
        }

        foreach (var userToRemove in command.RemoveRequest.UserIds)
        {
            var userToRemoveId = userToRemove.ToGuid();
            var isAppUserGroupChatExisting =
                await _unitOfWork.AppUserGroupChatsRepository.GetByAppUserAndGroupChatIdAsync(
                    userToRemoveId,
                    groupChatId
                );

            if (isAppUserGroupChatExisting is null)
            {
                _logger.LogError("User {Recipient} is not in this group chat", userToRemove);
                throw new HubException($"User {userToRemove} is not in this group chat");
            }

            await _unitOfWork.AppUserGroupChatsRepository.DeleteAsync(userToRemoveId);
        }

        await _unitOfWork.SaveChangesAsync();

        var memberIds = await _unitOfWork.AppUserGroupChatsRepository.GetGroupChatMemberIdsAsync(
            groupChatId
        );
        var existingMemberIds = memberIds.Where(
            x => command.RemoveRequest.UserIds.Contains(x) is false
        );

        await _hubContext.Clients
            .Users(existingMemberIds)
            .GroupChatMembersRemoved(
                new GroupChatMembersRemovedResponse
                {
                    GroupChatId = groupChatId.ToString(),
                    RemovedByUserId = appUserId.ToString(),
                    MemberIds = command.RemoveRequest.UserIds
                }
            );

        return true;
    }
}
