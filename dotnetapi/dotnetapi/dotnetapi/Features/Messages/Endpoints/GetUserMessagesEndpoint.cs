using dotnetapi.Features.Messages.Contracts.Responses;
using dotnetapi.Features.Messages.Handlers;
using dotnetapi.Features.Messages.Services;
using dotnetapi.Models.Entities;
using FastEndpoints;
using Mediator;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace dotnetapi.Features.Messages.Endpoints;

[Authorize]
public class GetUserMessagesEndpoint : EndpointWithoutRequest<UserManyMessagesResponse>
{
    private readonly ILogger<GetUserMessagesEndpoint> _logger;
    private readonly IMediator _mediator;
    private readonly IMessagesRepository _messagesRepository;
    private readonly UserManager<AppUser> _userManager;

    public GetUserMessagesEndpoint(
        ILogger<GetUserMessagesEndpoint> logger,
        IMessagesRepository messagesRepository,
        IMediator mediator,
        UserManager<AppUser> userManager)
    {
        _logger = logger;
        _messagesRepository = messagesRepository;
        _mediator = mediator;
        _userManager = userManager;
    }

    public override void Configure()
    {
        Get("messages/user/{recipientUserName}");
        Policies("BeAuthenticated");
    }

    public override async Task HandleAsync(CancellationToken ct)
    {
        var appUser = await _userManager.GetUserAsync(User);
        if (appUser is null)
        {
            _logger.LogError("Bad request, User is invalid");
            ThrowError("UserName is invalid");
        }

        var recipientUserName = Route<string>("recipientUserName");
        if (string.IsNullOrEmpty(recipientUserName)) ThrowError("Invalid recipientUserName");

        var recipient = await _userManager.Users.Where(x => x.UserName == recipientUserName).SingleOrDefaultAsync(ct);
        if (recipient is null)
        {
            _logger.LogError("Bad request, Recipient is invalid");
            ThrowError("Recipient is invalid");
        }

        var conversationMessages = await _mediator.Send(new GetUserMessagesByUserNameQuery(appUser, recipient), ct);
        // var conversationMessages = await _messagesRepository.GetUserMessagesAsync(user, recipient);

        var response = new UserManyMessagesResponse
        {
            MessagesWith = recipientUserName,
            Messages = conversationMessages
        };

        await SendOkAsync(response, ct);
    }
}