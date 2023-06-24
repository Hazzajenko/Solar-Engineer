using Infrastructure.Extensions;
using Mediator;
using Messages.Application.Data.UnitOfWork;
using Messages.Application.Mapping;
using Messages.Domain.Entities;
using Messages.SignalR.Commands.GroupChats;
using Messages.SignalR.Hubs;
using Microsoft.AspNetCore.SignalR;

namespace Messages.Application.Handlers.GroupChats;

public class InviteUsersToGroupChatHandler : IQueryHandler<InviteUsersToGroupChatCommand, bool>
{
    private readonly IHubContext<MessagesHub, IMessagesHub> _hubContext;
    private readonly ILogger<InviteUsersToGroupChatHandler> _logger;
    private readonly IMessagesUnitOfWork _unitOfWork;

    public InviteUsersToGroupChatHandler(
        ILogger<InviteUsersToGroupChatHandler> logger,
        IMessagesUnitOfWork unitOfWork,
        IHubContext<MessagesHub, IMessagesHub> hubContext
    )
    {
        _logger = logger;
        _unitOfWork = unitOfWork;
        _hubContext = hubContext;
    }

    public async ValueTask<bool> Handle(InviteUsersToGroupChatCommand command, CancellationToken cT)
    {
        var appUserId = command.AuthUser.Id;
        var groupChatId = command.InviteRequest.GroupChatId.ToGuid();

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

        if (appUserGroupChat.CanInvite is false)
        {
            _logger.LogError("Bad request, appUser does not have invite permissions");
            throw new HubException("User does not have invite permissions");
        }

        var newAppUserGroupChats = new List<AppUserGroupChat>();

        foreach (var requestInvite in command.InviteRequest.Invites)
        {
            var invitedUserId = requestInvite.UserId.ToGuid();
            var isAppUserGroupChatExisting =
                await _unitOfWork.AppUserGroupChatsRepository.GetByAppUserAndGroupChatIdAsync(
                    invitedUserId,
                    groupChatId
                );

            if (isAppUserGroupChatExisting is not null)
            {
                _logger.LogError("User {Recipient} is already in group chat", requestInvite.UserId);
                throw new HubException($"User {requestInvite.UserId} is already in group chat");
            }

            var invitedUserAppUserGroupChat = new AppUserGroupChat
            {
                GroupChat = appUserGroupChat.GroupChat,
                Role = requestInvite.Role,
                CanInvite = true,
                CanKick = true,
                AppUserId = invitedUserId
            };
            // await _unitOfWork.AppUserGroupChatsRepository.AddAsync(invitedUserAppUserGroupChat);
            // await _unitOfWork.SaveChangesAsync();
            newAppUserGroupChats.Add(invitedUserAppUserGroupChat);
        }

        await _unitOfWork.AppUserGroupChatsRepository.AddRangeAsync(newAppUserGroupChats);
        await _unitOfWork.SaveChangesAsync();

        var invitedUserIds = newAppUserGroupChats.Select(x => x.AppUserId.ToString());
        var memberIds = await _unitOfWork.AppUserGroupChatsRepository.GetGroupChatMemberIdsAsync(
            groupChatId
        );
        var existingMemberIds = memberIds.Where(x => invitedUserIds.Contains(x) is false);

        var newMembers = newAppUserGroupChats.Select(x => x.ToInitialMemberDto());

        var groupChatServerMessages = newAppUserGroupChats
            .ToServerMessage(appUserId)
            .ToCombinedDtoList();

        await _hubContext.Clients
            .Users(existingMemberIds)
            .GetGroupChatMessages(groupChatServerMessages);

        await _hubContext.Clients.Users(existingMemberIds).AddGroupChatMembers(newMembers);

        _logger.LogInformation(
            "User {User} invited {InvitesLength} users to group chat {GroupChat}",
            appUserId,
            invitedUserIds.Count(),
            groupChatId
        );

        return true;
    }
}
