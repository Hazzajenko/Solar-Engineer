using dotnetapi.Features.Conversations.Contracts.Requests;
using dotnetapi.Features.Conversations.Contracts.Responses;
using dotnetapi.Features.Conversations.Entities;
using dotnetapi.Features.Conversations.Mapping;
using dotnetapi.Features.Conversations.Services;
using dotnetapi.Models.Entities;
using FastEndpoints;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace dotnetapi.Features.Conversations.Endpoints;

[Authorize]
public class InviteToConversationEndpoint : Endpoint<InviteToConversationRequest, InviteManyToConversationResponse>
{
    private readonly IConversationsRepository _conversationsRepository;
    private readonly ILogger<InviteToConversationEndpoint> _logger;
    private readonly UserManager<AppUser> _userManager;

    public InviteToConversationEndpoint(
        ILogger<InviteToConversationEndpoint> logger,
        IConversationsRepository conversationsRepository,
        UserManager<AppUser> userManager)
    {
        _logger = logger;
        _conversationsRepository = conversationsRepository;
        _userManager = userManager;
    }

    public override void Configure()
    {
        Post("conversation/{conversationId:int}/invite");
        Policies("BeAuthenticated");
    }

    public override async Task HandleAsync(InviteToConversationRequest request, CancellationToken ct)
    {
        var user = await _userManager.GetUserAsync(User);
        if (user is null)
        {
            _logger.LogError("Bad request, User is invalid");
            ThrowError("Username is invalid");
        }

        var conversationId = Route<int>("conversationId");
        if (conversationId < 0) ThrowError("Invalid conversationId");


        var appUserConversation = await _conversationsRepository.GetAppUserConversationAsync(user, conversationId);
        if (appUserConversation is null)
        {
            _logger.LogError("Bad request, appUserConversation is invalid");
            ThrowError("appUserConversation is invalid");
        }

        if (appUserConversation.CanInvite is false)
        {
            _logger.LogError("Bad request, appUser does not have invite roles");
            ThrowError("Bad request, appUser does not have invite roles");
        }

        var newMembers = new List<ConversationMemberDto>();

        foreach (var requestInvite in request.Invites)
        {
            var recipient = await _userManager.Users.Where(x => x.UserName == requestInvite.Recipient)
                .SingleOrDefaultAsync(ct);

            if (recipient is null)
            {
                _logger.LogError("Recipient {Recipient} does not exist", requestInvite.Recipient);
                ThrowError($"Recipient {requestInvite.Recipient} does not exist");
            }

            var inviteRecipientConversation = new AppUserConversation
            {
                Conversation = appUserConversation.Conversation,
                Role = requestInvite.Role,
                CanInvite = false,
                CanKick = false,
                AppUser = recipient,
                JoinedAt = DateTime.Now
            };
            var result = await _conversationsRepository.InviteToConversationAsync(inviteRecipientConversation);
            newMembers.Add(result.ToMemberDto());
        }

        var response = new InviteManyToConversationResponse
        {
            NewMembers = newMembers
        };

        await SendOkAsync(response, ct);
    }
}