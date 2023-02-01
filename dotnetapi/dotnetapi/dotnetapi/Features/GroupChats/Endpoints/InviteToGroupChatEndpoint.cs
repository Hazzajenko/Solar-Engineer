﻿/*using dotnetapi.Features.GroupChats.Contracts.Requests;
using dotnetapi.Features.GroupChats.Entities;
using dotnetapi.Features.GroupChats.Handlers;
using dotnetapi.Features.GroupChats.Services;
using dotnetapi.Features.Users.Handlers;
using dotnetapi.Models.Entities;
using FastEndpoints;
using Mediator;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;

namespace dotnetapi.Features.GroupChats.Endpoints;

[Authorize]
public class InviteToGroupChatEndpoint : Endpoint<InviteToGroupChatRequest>
{
    private readonly IGroupChatsRepository _groupChatsRepository;
    private readonly ILogger<InviteToGroupChatEndpoint> _logger;
    private readonly IMediator _mediator;
    private readonly UserManager<AppUser> _userManager;

    public InviteToGroupChatEndpoint(
        ILogger<InviteToGroupChatEndpoint> logger,
        IGroupChatsRepository groupChatsRepository,
        IMediator mediator,
        UserManager<AppUser> userManager)
    {
        _logger = logger;
        _groupChatsRepository = groupChatsRepository;
        _mediator = mediator;
        _userManager = userManager;
    }

    public override void Configure()
    {
        Post("group-chats/{groupChatId:int}/invites");
        Policies("BeAuthenticated");
    }

    public override async Task HandleAsync(InviteToGroupChatRequest request, CancellationToken ct)
    {
        var appUser = await _userManager.GetUserAsync(User);
        if (appUser is null)
        {
            _logger.LogError("Bad request, User is invalid");
            ThrowError("UserName is invalid");
        }

        var groupChatId = Route<int>("groupChatId");
        if (groupChatId < 0) ThrowError("Invalid groupChatId");


        var appUserGroupChat = await _mediator.Send(new GetAppUserGroupChatQuery(appUser, groupChatId), ct);

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


        var invitedMembers = new List<GroupChatMemberDto>();
        var newAppUserGroupChats = new List<AppUserGroupChat>();

        foreach (var requestInvite in request.Invites)
        {
            var invitedUser = await _mediator.Send(new GetUserByUserNameQuery(requestInvite.UserName), ct);
            /*var recipient = await _userManager.Users.Where(x => x.UserName == requestInvite.Recipient)
                .SingleOrDefaultAsync(ct);#1#

            if (invitedUser is null)
            {
                _logger.LogError("Recipient {Recipient} does not exist", requestInvite.UserName);
                ThrowError($"Recipient {requestInvite.UserName} does not exist");
            }

            var isAppUserGroupChatExisting =
                await _mediator.Send(new GetAppUserGroupChatQuery(invitedUser, groupChatId), ct);

            if (isAppUserGroupChatExisting is not null)
            {
                _logger.LogError("User {User} is already a group chat member", invitedUser.UserName);
                ThrowError($"User {invitedUser.UserName} is already a group chat member");
            }

            var invitedUserAppUserGroupChat = new AppUserGroupChat
            {
                GroupChat = appUserGroupChat.GroupChat,
                Role = requestInvite.Role,
                CanInvite = false,
                CanKick = false,
                AppUser = invitedUser,
                JoinedAt = DateTime.Now
            };
            newAppUserGroupChats.Add(invitedUserAppUserGroupChat);
            /*var result = await _mediator.Send(new CreateAppUserGroupChatsQuery(invitedUserAppUserGroupChat), ct);
            // var result = await _groupChatsRepository.InviteToGroupChatAsync(inviteRecipientGroupChat);
            invitedMembers.AddRange(result.ToMemberDto());#1#
        }

        var result = await _mediator.Send(new CreateManyAppUserGroupChatsQuery(groupChatId, newAppUserGroupChats), ct);
        // var result = await _groupChatsRepository.InviteToGroupChatAsync(inviteRecipientGroupChat);
        // invitedMembers.AddRange(result.ToMemberDto());

        var groupChatServerMessage = new GroupChatServerMessage
        {
            GroupChat = appUserGroupChat.GroupChat,
            Content =
                $"{appUser} invited {result.Count()} {MemberOrMembers(result.Count())} to {appUserGroupChat.GroupChat.Name}"
        };


        await _mediator.Send(new CreateGroupChatServerMessageQuery(groupChatServerMessage), ct);

        /*
        var groupMemberUserNames = await _mediator.Send(new GetGroupChatMemberUserNamesQuery(groupChatId), ct);

        var sendSignalRMessage =
            await _mediator.Send(
                new SendServerMessageToGroupChatQuery(sendServerMessage, groupMemberUserNames.UserNames), ct);#1#

        /*
        if (sendSignalRMessage is false)
        {
            _logger.LogError("Group {Group} has no members to update",
                groupChatId);
            await SendNotFoundAsync(ct);
            return;
            // ThrowError("User is not apart of group chat");
        }#1#

        /*var serverMessages = new List<GroupChatServerMessageDto>
        {
            sendServerMessage.ToDto()
        };

        var response = new InviteManyToGroupChatResponse
        {
            NewMembers = invitedMembers,
            ServerMessages = serverMessages
        };#1#

        await SendNoContentAsync(ct);
    }

    private string MemberOrMembers(int count)
    {
        if (count > 1) return "members";

        return "member";
    }
}*/

