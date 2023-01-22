using dotnetapi.Features.Conversations.Contracts.Responses;
using dotnetapi.Features.Conversations.Services;
using dotnetapi.Models.Entities;
using FastEndpoints;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;

namespace dotnetapi.Features.Conversations.Endpoints;

[Authorize]
public class GetConversationMembersEndpoint : EndpointWithoutRequest<ConversationMembersResponse>
{
    private readonly IConversationsRepository _conversationsRepository;
    private readonly ILogger<GetConversationMembersEndpoint> _logger;
    private readonly UserManager<AppUser> _userManager;

    public GetConversationMembersEndpoint(
        ILogger<GetConversationMembersEndpoint> logger,
        IConversationsRepository conversationsRepository,
        UserManager<AppUser> userManager)
    {
        _logger = logger;
        _conversationsRepository = conversationsRepository;
        _userManager = userManager;
    }

    public override void Configure()
    {
        Get("conversation/{conversationId:int}/members");
        Policies("BeAuthenticated");
    }

    public override async Task HandleAsync(CancellationToken ct)
    {
        var user = await _userManager.GetUserAsync(User);
        if (user is null)
        {
            _logger.LogError("Bad request, User is invalid");
            ThrowError("Username is invalid");
        }

        var conversationId = Route<int>("conversationId");
        if (conversationId < 0) ThrowError("Invalid conversationId");


        var result = await _conversationsRepository.GetConversationMembersAsync(user, conversationId);

        var conversationMemberDtos = result.ToList();
        var isAppUserInConversation = conversationMemberDtos.SingleOrDefault(x => x.Username == user.UserName!);

        if (isAppUserInConversation is null)
        {
            _logger.LogError("User {User} is not in Conversation", user.UserName);
            ThrowError("User is not in Conversation");
        }

        var response = new ConversationMembersResponse
        {
            Members = conversationMemberDtos
        };

        await SendOkAsync(response, ct);
    }
}