using dotnetapi.Contracts.Responses;
using dotnetapi.Features.Messages.Contracts.Requests;
using dotnetapi.Features.Messages.Services;
using dotnetapi.Models.Entities;
using FastEndpoints;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;

namespace dotnetapi.Features.Messages.Endpoints;

[Authorize]
public class UpdateManyMessagesEndpoint : Endpoint<UpdateManyMessagesRequest, ManyUpdatesResponse>
{
    private readonly ILogger<UpdateManyMessagesEndpoint> _logger;
    private readonly IMessagesRepository _messagesRepository;
    private readonly UserManager<AppUser> _userManager;

    public UpdateManyMessagesEndpoint(
        ILogger<UpdateManyMessagesEndpoint> logger,
        IMessagesRepository messagesRepository,
        UserManager<AppUser> userManager)
    {
        _logger = logger;
        _messagesRepository = messagesRepository;
        _userManager = userManager;
    }

    public override void Configure()
    {
        Put("messages");
        Policies("BeAuthenticated");
    }

    public override async Task HandleAsync(UpdateManyMessagesRequest request, CancellationToken ct)
    {
        var user = await _userManager.GetUserAsync(User);
        if (user is null)
        {
            _logger.LogError("Bad request, User is invalid");
            ThrowError("UserName is invalid");
        }

        var updates = new bool[request.Updates.Count()];
        var index = 0;
        foreach (var message in request.Updates)
        {
            updates[index] = await _messagesRepository.UpdateMessageAsync(message);
            index++;
        }

        var successfulUpdates = 0;
        var errors = 0;
        foreach (var update in updates)
            if (!update)
                errors++;
            else
                successfulUpdates++;


        var response = new ManyUpdatesResponse
        {
            Updates = successfulUpdates,
            Errors = errors
        };

        await SendOkAsync(response, ct);
    }
}