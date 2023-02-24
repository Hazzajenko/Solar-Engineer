using Mediator;
using Messages.API.Contracts.Requests;
using Messages.API.Handlers.SignalR;
using Microsoft.AspNetCore.SignalR;

namespace Messages.API.Hubs;

public class MessagesHub : Hub<IMessagesHub>
{
    private readonly IMediator _mediator;


    public MessagesHub(
        IMediator mediator
    )
    {
        _mediator = mediator;
    }

    public async Task RemoveUsersFromGroupChat(RemoveUsersFromGroupChatRequest request)
    {
        await _mediator.Send(new RemoveUsersFromGroupChatCommand(Context, request));
    }

    public async Task InviteUsersToGroupChat(InviteUsersToGroupChatRequest request)
    {
        await _mediator.Send(new InviteUsersToGroupChatCommand(Context, request));
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