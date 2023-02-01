using dotnetapi.Features.GroupChats.Entities;
using dotnetapi.Features.GroupChats.Handlers;
using dotnetapi.Features.Users.Handlers;
using dotnetapi.Models.Entities;
using FastEndpoints;
using Mediator;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;

namespace dotnetapi.Features.GroupChats.Endpoints.InviteUsersToGroupChat;

[Authorize]
public class InviteUsersToGroupChatEndpoint : Endpoint<InviteUsersToGroupChatRequest>
{
    private readonly ILogger<InviteUsersToGroupChatEndpoint> _logger;
    private readonly IMediator _mediator;
    private readonly UserManager<AppUser> _userManager;

    public InviteUsersToGroupChatEndpoint(
        ILogger<InviteUsersToGroupChatEndpoint> logger,
        IMediator mediator,
        UserManager<AppUser> userManager
    )
    {
        _logger = logger;
        _mediator = mediator;
        _userManager = userManager;
    }

    public override void Configure()
    {
        Post("group-chats/{@groupChatId}/invites", x => new { x.GroupChatId });
        Policies("BeAuthenticated");
    }

    public override async Task HandleAsync(
        InviteUsersToGroupChatRequest request,
        CancellationToken ct
    )
    {
        var appUser = await _userManager.GetUserAsync(User);
        if (appUser is null)
        {
            _logger.LogError("Bad request, User is invalid");
            ThrowError("UserName is invalid");
        }

        var groupChatId = Route<int>("groupChatId");
        if (groupChatId < 0)
            ThrowError("Invalid groupChatId");

        if (groupChatId != request.GroupChatId)
        {
            _logger.LogCritical(
                "User {User} sent a bad request with 2 group ids, {First}, {Second}",
                appUser.UserName,
                groupChatId,
                request.GroupChatId
            );
            ThrowError("Cannot use two different group chat ids");
        }

        var appUserGroupChat = await _mediator.Send(
            new GetAppUserGroupChatQuery(appUser, groupChatId),
            ct
        );

        // var appUserGroupChat = await _groupChatsRepository.GetAppUserGroupChatAsync(user, groupChatId);
        if (appUserGroupChat is null)
        {
            _logger.LogError("Bad request, appUserGroupChat is invalid");
            ThrowError("appUserGroupChat is invalid");
        }

        if (appUserGroupChat.CanInvite is false)
        {
            _logger.LogError("Bad request, appUser does not have invite roles");
            ThrowError("Bad request, appUser does not have invite roles");
        }

        var newAppUserGroupChats = new List<AppUserGroupChat>();

        foreach (var requestInvite in request.Invites)
        {
            var invitedUser = await _mediator.Send(
                new GetUserByUserNameQuery(requestInvite.UserName),
                ct
            );

            if (invitedUser is null)
            {
                _logger.LogError("Recipient {Recipient} does not exist", requestInvite.UserName);
                ThrowError($"Recipient {requestInvite.UserName} does not exist");
            }

            var isAppUserGroupChatExisting = await _mediator.Send(
                new GetAppUserGroupChatQuery(invitedUser, groupChatId),
                ct
            );

            if (isAppUserGroupChatExisting is not null)
            {
                _logger.LogError(
                    "User {User} is already a group chat member",
                    invitedUser.UserName
                );
                ThrowError($"User {invitedUser.UserName} is already a group chat member");
            }

            var invitedUserAppUserGroupChat = new AppUserGroupChat
            {
                GroupChat = appUserGroupChat.GroupChat,
                Role = requestInvite.Role,
                CanInvite = true,
                CanKick = true,
                AppUser = invitedUser,
                JoinedAt = DateTime.Now
            };
            newAppUserGroupChats.Add(invitedUserAppUserGroupChat);
        }

        var invitedMembers = await _mediator.Send(
            new CreateManyAppUserGroupChatsQuery(groupChatId, newAppUserGroupChats),
            ct
        );

        var groupChatServerMessage = invitedMembers.ToServerMessage(appUser);
        /*var groupChatServerMessage = new GroupChatServerMessage
        {
            GroupChat = appUserGroupChat.GroupChat,
            Content =
                $"{appUser} invited {invitedMembers.Count()} {MemberOrMembers(invitedMembers.Count())} to {appUserGroupChat.GroupChat.Name}"
        };*/

        await _mediator.Send(new CreateGroupChatServerMessageQuery(groupChatServerMessage), ct);

        await SendNoContentAsync(ct);
    }

    private string MemberOrMembers(int count)
    {
        if (count > 1)
            return "members";

        return "member";
    }
}