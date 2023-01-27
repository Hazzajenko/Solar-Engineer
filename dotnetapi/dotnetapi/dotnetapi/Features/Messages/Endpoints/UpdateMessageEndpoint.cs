using dotnetapi.Contracts.Responses;
using dotnetapi.Features.Messages.Contracts.Requests;
using dotnetapi.Features.Messages.Services;
using dotnetapi.Models.Entities;
using FastEndpoints;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;

// using dotnetapi.Services.Notifications;

namespace dotnetapi.Features.Messages.Endpoints;

[Authorize]
public class UpdateMessageEndpoint : Endpoint<UpdateMessageRequest, OneUpdateResponse>
{
    private readonly ILogger<UpdateMessageEndpoint> _logger;
    private readonly IMessagesRepository _messagesRepository;
    private readonly UserManager<AppUser> _userManager;

    public UpdateMessageEndpoint(
        ILogger<UpdateMessageEndpoint> logger,
        IMessagesRepository messagesRepository,
        UserManager<AppUser> userManager)
    {
        _logger = logger;
        _messagesRepository = messagesRepository;
        _userManager = userManager;
    }

    public override void Configure()
    {
        Put("/message/{messageId:int}");
        Policies("BeAuthenticated");
        // Roles("Admin");
    }

    public override async Task HandleAsync(UpdateMessageRequest request, CancellationToken cT)
    {
        var user = await _userManager.GetUserAsync(User);
        if (user is null)
        {
            _logger.LogError("Bad request, User is invalid");
            ThrowError("UserName is invalid");
        }

        var messageId = Route<int>("messageId");
        if (messageId < 0) ThrowError("Invalid messageId");

        var update = await _messagesRepository.UpdateMessageAsync(request);

        if (!update)
        {
            _logger.LogError("Notification Update Error");
            ThrowError("Notification Update Error");
        }

        var response = new OneUpdateResponse
        {
            Update = true
        };

        await SendOkAsync(response, cT);
    }
}