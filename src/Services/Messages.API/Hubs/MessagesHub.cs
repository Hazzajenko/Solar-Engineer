using Mediator;
using Messages.API.Contracts.Requests;
using Messages.API.Handlers;
using Microsoft.AspNetCore.SignalR;

namespace Messages.API.Hubs;

public class MessagesHub : Hub<IMessagesHub>
{
    private readonly ILogger<MessagesHub> _logger;
    private readonly IMediator _mediator;


    public MessagesHub(
        IMediator mediator,
        ILogger<MessagesHub> logger
    )
    {
        _mediator = mediator;
        _logger = logger;
    }

    public async Task GetMessagesWithUser(string recipientId)
    {
        await _mediator.Send(new GetMessagesWithUserQuery(Context, recipientId));
    }

    public async Task GetGroupChatMessages(string groupChatId)
    {
        await _mediator.Send(new GetGroupChatMessagesQuery(Context, groupChatId));
    }

    public async Task SendMessageToUser(SendMessageRequest request)
    {
        await _mediator.Send(new SendMessageToUserCommand(Context, request));
    }

    public async Task SendMessageToGroupChat(SendGroupChatMessageRequest request)
    {
        await _mediator.Send(new SendMessageToGroupChatCommand(Context, request));
    }
}