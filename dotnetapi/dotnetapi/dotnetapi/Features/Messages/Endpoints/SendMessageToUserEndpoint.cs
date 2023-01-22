using dotnetapi.Features.Messages.Contracts.Requests;
using dotnetapi.Features.Messages.Contracts.Responses;
using dotnetapi.Features.Messages.Mapping;
using dotnetapi.Features.Messages.Services;
using dotnetapi.Models.Entities;
using FastEndpoints;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace dotnetapi.Features.Messages.Endpoints;

[Authorize]
public class SendMessageToUserEndpoint : Endpoint<SendMessageRequest, MessageResponse>
{
    private readonly ILogger<SendMessageToUserEndpoint> _logger;
    private readonly IMessagesRepository _messagesRepository;

    private readonly IMessagesService _messagesService;

    // private readonly IPublishEndpoint _publishEndpoint;
    private readonly UserManager<AppUser> _userManager;

    public SendMessageToUserEndpoint(
        ILogger<SendMessageToUserEndpoint> logger,
        // IPublishEndpoint publishEndpoint,
        IMessagesRepository messagesRepository,
        IMessagesService messagesService,
        UserManager<AppUser> userManager)
    {
        _logger = logger;
        // _publishEndpoint = publishEndpoint;
        _messagesRepository = messagesRepository;
        _messagesService = messagesService;
        _userManager = userManager;
    }

    public override void Configure()
    {
        Post("message/user/{recipientUsername}");
        Policies("BeAuthenticated");
    }

    public override async Task HandleAsync(SendMessageRequest request, CancellationToken ct)
    {
        var user = await _userManager.GetUserAsync(User);
        if (user is null)
        {
            _logger.LogError("Bad request, User is invalid");
            ThrowError("Username is invalid");
        }

        var recipientUsername = Route<string>("recipientUsername");
        if (string.IsNullOrEmpty(recipientUsername)) ThrowError("Invalid recipientUsername");

        var recipient = await _userManager.Users.Where(x => x.UserName == recipientUsername).SingleOrDefaultAsync(ct);
        if (recipient is null)
        {
            _logger.LogError("Bad request, Recipient is invalid");
            ThrowError("Recipient is invalid");
        }

        var message = request.ToEntity(user, recipient);

        var result = await _messagesRepository.AddMessageAsync(message);

        var updateConnections = await _messagesService.SendMessageToUserAsync(recipient, result.ToDto());

        var response = new MessageResponse
        {
            Message = result.ToDto()
        };

        /*
        await  _consumer.Consume()
         var thing = new SubmitOrderConsumer();
         var hi = new ConsumeContext<AccountConsumer>
         {
             
         }
         thing.Consume()*/

        /*
        await _publishEndpoint.Publish<AccountConsumer>(new
        {
            Pong = "Ping"
        }, ct);
            

        await _publishEndpoint.Publish<PingMessage>(new
        {
            Pong = "Ping"
        }, ct);*/

        await SendOkAsync(response, ct);
    }
}