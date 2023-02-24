using Infrastructure.Extensions;
using Mediator;
using Messages.API.Contracts.Requests;
using Messages.API.Data;
using Messages.API.Entities;
using Messages.API.Hubs;
using Messages.API.Mapping;
using Microsoft.AspNetCore.SignalR;

namespace Messages.API.Handlers.SignalR;

public sealed record InviteUsersToGroupChatCommand(HubCallerContext Context,
        InviteUsersToGroupChatRequest InviteRequest)
    : IQuery<bool>;

public class InviteUsersToGroupChatHandler
    : IQueryHandler<InviteUsersToGroupChatCommand, bool>
{
    private readonly IHubContext<MessagesHub, IMessagesHub> _hubContext;
    private readonly ILogger<InviteUsersToGroupChatHandler> _logger;
    private readonly IMessagesUnitOfWork _unitOfWork;


    public InviteUsersToGroupChatHandler(ILogger<InviteUsersToGroupChatHandler> logger, IMessagesUnitOfWork unitOfWork,
        IHubContext<MessagesHub, IMessagesHub> hubContext)
    {
        _logger = logger;
        _unitOfWork = unitOfWork;
        _hubContext = hubContext;
    }

    public async ValueTask<bool> Handle(
        InviteUsersToGroupChatCommand request,
        CancellationToken cT
    )
    {
        if (request.Context.User is null) throw new HubException("Context user is null");

        var appUserId = request.Context.User.GetUserId().ToGuid();
        var groupChatId = request.InviteRequest.GroupChatId.ToGuid();

        var appUserGroupChat =
            await _unitOfWork.UserGroupChatsRepository.GetByAppUserAndGroupChatIdAsync(appUserId, groupChatId);
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

        foreach (var requestInvite in request.InviteRequest.Invites)
        {
            var invitedUserId = requestInvite.UserId.ToGuid();
            var isAppUserGroupChatExisting =
                await _unitOfWork.UserGroupChatsRepository.GetByAppUserAndGroupChatIdAsync(invitedUserId, groupChatId);


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
            newAppUserGroupChats.Add(invitedUserAppUserGroupChat);
        }

        await _unitOfWork.UserGroupChatsRepository.AddRangeAsync(newAppUserGroupChats);
        await _unitOfWork.SaveChangesAsync();

        var invitedUserIds = newAppUserGroupChats.Select(x => x.AppUserId.ToString());
        var memberIds = await _unitOfWork.UserGroupChatsRepository.GetGroupChatMemberIdsAsync(groupChatId);
        var existingMemberIds = memberIds.Where(x => invitedUserIds.Contains(x) is false);

        var newMembers = newAppUserGroupChats.Select(x => x.ToInitialMemberDto());

        var groupChatServerMessages = newAppUserGroupChats.ToServerMessage(appUserId).ToCombinedDtoList();


        await _hubContext.Clients.Users(existingMemberIds)
            .GetGroupChatMessages(groupChatServerMessages);

        await _hubContext.Clients.Users(existingMemberIds)
            .AddGroupChatMembers(newMembers);

        _logger.LogInformation("User {User} invited {InvitesLength} users to group chat {GroupChat}", appUserId,
            invitedUserIds.Count(), groupChatId);


        return true;
    }
}