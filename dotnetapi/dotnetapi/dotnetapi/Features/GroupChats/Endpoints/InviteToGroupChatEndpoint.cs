using dotnetapi.Features.GroupChats.Contracts.Requests;
using dotnetapi.Features.GroupChats.Contracts.Responses;
using dotnetapi.Features.GroupChats.Entities;
using dotnetapi.Features.GroupChats.Mapping;
using dotnetapi.Features.GroupChats.Services;
using dotnetapi.Models.Entities;
using FastEndpoints;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace dotnetapi.Features.GroupChats.Endpoints;

[Authorize]
public class InviteToGroupChatEndpoint : Endpoint<InviteToGroupChatRequest, InviteManyToGroupChatResponse>
{
    private readonly IGroupChatsRepository _groupChatsRepository;
    private readonly ILogger<InviteToGroupChatEndpoint> _logger;
    private readonly UserManager<AppUser> _userManager;

    public InviteToGroupChatEndpoint(
        ILogger<InviteToGroupChatEndpoint> logger,
        IGroupChatsRepository groupChatsRepository,
        UserManager<AppUser> userManager)
    {
        _logger = logger;
        _groupChatsRepository = groupChatsRepository;
        _userManager = userManager;
    }

    public override void Configure()
    {
        Post("group-chat/{groupChatId:int}/invite");
        Policies("BeAuthenticated");
    }

    public override async Task HandleAsync(InviteToGroupChatRequest request, CancellationToken ct)
    {
        var user = await _userManager.GetUserAsync(User);
        if (user is null)
        {
            _logger.LogError("Bad request, User is invalid");
            ThrowError("UserName is invalid");
        }

        var groupChatId = Route<int>("groupChatId");
        if (groupChatId < 0) ThrowError("Invalid groupChatId");


        var appUserGroupChat = await _groupChatsRepository.GetAppUserGroupChatAsync(user, groupChatId);
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

        var newMembers = new List<GroupChatMemberDto>();

        foreach (var requestInvite in request.Invites)
        {
            var recipient = await _userManager.Users.Where(x => x.UserName == requestInvite.Recipient)
                .SingleOrDefaultAsync(ct);

            if (recipient is null)
            {
                _logger.LogError("Recipient {Recipient} does not exist", requestInvite.Recipient);
                ThrowError($"Recipient {requestInvite.Recipient} does not exist");
            }

            var inviteRecipientGroupChat = new AppUserGroupChat
            {
                GroupChat = appUserGroupChat.GroupChat,
                Role = requestInvite.Role,
                CanInvite = false,
                CanKick = false,
                AppUser = recipient,
                JoinedAt = DateTime.Now
            };
            var result = await _groupChatsRepository.InviteToGroupChatAsync(inviteRecipientGroupChat);
            newMembers.Add(result.ToMemberDto());
        }

        var response = new InviteManyToGroupChatResponse
        {
            NewMembers = newMembers
        };

        await SendOkAsync(response, ct);
    }
}