using Infrastructure.Extensions;
using Mediator;
using Messages.API.Contracts.Requests;
using Messages.API.Data;
using Messages.API.Hubs;
using Microsoft.AspNetCore.SignalR;

namespace Messages.API.Handlers.SignalR;

public sealed record RemoveUsersFromGroupChatCommand(HubCallerContext Context,
        RemoveUsersFromGroupChatRequest RemoveRequest)
    : IQuery<bool>;

public class RemoveUsersFromGroupChatHandler
    : IQueryHandler<RemoveUsersFromGroupChatCommand, bool>
{
    private readonly IHubContext<MessagesHub, IMessagesHub> _hubContext;
    private readonly ILogger<RemoveUsersFromGroupChatHandler> _logger;
    private readonly IMessagesUnitOfWork _unitOfWork;


    public RemoveUsersFromGroupChatHandler(ILogger<RemoveUsersFromGroupChatHandler> logger, IMessagesUnitOfWork unitOfWork,
        IHubContext<MessagesHub, IMessagesHub> hubContext)
    {
        _logger = logger;
        _unitOfWork = unitOfWork;
        _hubContext = hubContext;
    }

    public async ValueTask<bool> Handle(
        RemoveUsersFromGroupChatCommand request,
        CancellationToken cT
    )
    {
        if (request.Context.User is null) throw new HubException("Context user is null");

        var appUserId = request.Context.User.GetUserId().ToGuid();
        var groupChatId = request.RemoveRequest.GroupChatId.ToGuid();

        var appUserGroupChat =
            await _unitOfWork.UserGroupChatsRepository.GetByAppUserAndGroupChatIdAsync(appUserId, groupChatId);
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


        foreach (var userToRemove in request.RemoveRequest.UserIds)
        {
            var userToRemoveId = userToRemove.ToGuid();
            var isAppUserGroupChatExisting =
                await _unitOfWork.UserGroupChatsRepository.GetByAppUserAndGroupChatIdAsync(userToRemoveId, groupChatId);

            if (isAppUserGroupChatExisting is null)
            {
                _logger.LogError("User {Recipient} is not in this group chat", userToRemove);
                throw new HubException($"User {userToRemove} is not in this group chat");
            }

            await _unitOfWork.UserGroupChatsRepository.DeleteAsync(userToRemoveId);
        }

        await _unitOfWork.SaveChangesAsync();

        var memberIds = await _unitOfWork.UserGroupChatsRepository.GetGroupChatMemberIdsAsync(groupChatId);
        var existingMemberIds = memberIds.Where(x => request.RemoveRequest.UserIds.Contains(x) is false);

        await _hubContext.Clients.Users(existingMemberIds)
            .RemoveGroupChatMembers(request.RemoveRequest.UserIds);

        return true;
    }
}