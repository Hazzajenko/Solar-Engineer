using FastEndpoints;
using Mediator;
using Messages.API.Contracts.Data;
using Messages.API.Contracts.Requests;
using Messages.API.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;

namespace Messages.API.Endpoints;

public class CreateGroupChatEndpoint : Endpoint<CreateGroupChatRequest>
{

    private readonly IMediator _mediator;

    public CreateGroupChatEndpoint(
        IMediator mediator)
    {
        _mediator = mediator;
    }

    public override void Configure()
    {
        Post("group-chats");
        Policies("BeAuthenticated");
    }

    public override async Task HandleAsync(CreateGroupChatRequest request, CancellationToken ct)
    {
/**/        /*var appUser = await _userManager.GetUserAsync(User);
        if (appUser is null)
        {
            _logger.LogError("Bad request, User is invalid");
            ThrowError("UserName is invalid");
        }


        var appUserGroupChat = new AppUserGroupChat
        {
            AppUser = appUser,
            Role = "Admin",
            CanInvite = true,
            CanKick = true,
            JoinedAt = DateTime.Now,
            GroupChat = new GroupChat
            {
                Name = request.GroupChatName,
                CreatedBy = appUser,
                PhotoUrl = appUser.PhotoUrl,
                Created = DateTime.Now
            }
        };

        /*var groupChat = new GroupChat
        {
            Name = request.GroupChatName,
            CreatedBy = appUser,
            PhotoUrl = appUser.PhotoUrl,
            AppUserGroupChats = new List<AppUserGroupChat> { appUserGroupChat }
        };


        appUserGroupChat.GroupChat = groupChat;#1#
        var queryParam = new List<AppUserGroupChat> { appUserGroupChat };

        var adminAppUserGroupChat = await _mediator.Send(new CreateAppUserGroupChatQuery(appUserGroupChat), ct);
        // var result = await _groupChatsRepository.CreateGroupChatAsync(appUserGroupChat);
        // appUserGroupChat.ToMemberDto();
        // result.GroupChat.ToResponse()

        var newGroupChatMembers = new List<AppUserGroupChat>();
        if (request.Invites.Any())
            // var invitedMembers = new List<GroupChatMemberDto>();
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
                    await _mediator.Send(new GetAppUserGroupChatQuery(invitedUser, adminAppUserGroupChat.GroupChatId),
                        ct);

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
                newGroupChatMembers.Add(invitedUserAppUserGroupChat);
                /*var result = await _mediator.Send(new CreateAppUserGroupChatsQuery(invitedUserAppUserGroupChat), ct);
                // var result = await _groupChatsRepository.InviteToGroupChatAsync(inviteRecipientGroupChat);
                groupChatMembers.Add(result.ToMemberDto());#1#
            }

        var result =
            await _mediator.Send(
                new CreateManyAppUserGroupChatsQuery(adminAppUserGroupChat.GroupChatId, newGroupChatMembers), ct);
        // var result = await _groupChatsRepository.InviteToGroupChatAsync(inviteRecipientGroupChat);
        // groupChatMembers.Add(result.ToMemberDto());

        var resultToInitialDto = result.Select(x => x.ToInitialMemberDto());
        var groupChatMembers = new List<InitialGroupChatMemberDto>(resultToInitialDto)
            { adminAppUserGroupChat.ToInitialMemberDto() };

        var groupChatServerMessage = new GroupChatServerMessage
        {
            GroupChat = adminAppUserGroupChat.GroupChat,
            Content = $"{appUser} created {adminAppUserGroupChat.GroupChat.Name}"
        };

        var sendServerMessage = await _mediator.Send(new CreateGroupChatServerMessageQuery(groupChatServerMessage), ct);
        var serverMessages = new List<GroupChatServerMessageDto>
        {
            sendServerMessage.ToDto()
        };

        var response = new CreateGroupChatResponse
        {
            GroupChat = adminAppUserGroupChat.ToInitialResponseDto(groupChatMembers, serverMessages)
        };
        // var response = adminAppUserGroupChat.GroupChat.ToResponse(new List<GroupChatMemberDto> { appUserGroupChat.ToMemberDto() });

        await SendOkAsync(response, ct);*/
    }
}