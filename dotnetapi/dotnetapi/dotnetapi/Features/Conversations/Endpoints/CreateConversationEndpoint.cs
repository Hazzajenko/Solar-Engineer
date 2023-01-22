using dotnetapi.Features.Conversations.Contracts.Requests;
using dotnetapi.Features.Conversations.Contracts.Responses;
using dotnetapi.Features.Conversations.Entities;
using dotnetapi.Features.Conversations.Services;
using dotnetapi.Mapping;
using dotnetapi.Models.Entities;
using FastEndpoints;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;

namespace dotnetapi.Features.Conversations.Endpoints;

[Authorize]
public class CreateConversationEndpoint : Endpoint<CreateConversationRequest, CreateConversationResponse>
{
    private readonly IConversationsRepository _conversationsRepository;
    private readonly ILogger<CreateConversationEndpoint> _logger;
    private readonly UserManager<AppUser> _userManager;

    public CreateConversationEndpoint(
        ILogger<CreateConversationEndpoint> logger,
        IConversationsRepository conversationsRepository,
        UserManager<AppUser> userManager)
    {
        _logger = logger;
        _conversationsRepository = conversationsRepository;
        _userManager = userManager;
    }

    public override void Configure()
    {
        Post("conversation");
        Policies("BeAuthenticated");
    }

    public override async Task HandleAsync(CreateConversationRequest request, CancellationToken ct)
    {
        var user = await _userManager.GetUserAsync(User);
        if (user is null)
        {
            _logger.LogError("Bad request, User is invalid");
            ThrowError("Username is invalid");
        }


        var appUserConversation = new AppUserConversation
        {
            AppUser = user,
            Role = "Admin",
            CanInvite = true,
            CanKick = true,
            JoinedAt = DateTime.Now
        };

        var conversation = new Conversation
        {
            Name = request.Name,
            AppUserConversations = new List<AppUserConversation> { appUserConversation }
        };

        appUserConversation.Conversation = conversation;

        var result = await _conversationsRepository.CreateConversationAsync(appUserConversation);

        var member = user.ToDto();
        // member.

        var response = new CreateConversationResponse
        {
            Conversation = new ConversationDto
            {
                Id = result.Id,
                Name = result.Name,
                Members = new List<ConversationMemberDto>
                {
                    new()
                    {
                        FirstName = user.FirstName,
                        Role = "Admin",
                        Username = user.UserName!,
                        LastName = user.LastName,
                        JoinedConversationAt = DateTime.Now
                    }
                }
            }
        };

        await SendOkAsync(response, ct);
    }
}