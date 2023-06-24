using Infrastructure.SignalR;
using Mediator;
using Messages.Contracts.Requests;
using Messages.SignalR.Commands.GroupChats;
using Messages.SignalR.Queries.GroupChats;
using Microsoft.AspNetCore.SignalR;

namespace Messages.SignalR.Hubs;

public class MessagesHub : Hub<IMessagesHub>
{
    private readonly IMediator _mediator;

    public MessagesHub(IMediator mediator)
    {
        _mediator = mediator;
    }

    public async Task RemoveUsersFromGroupChat(RemoveUsersFromGroupChatRequest request)
    {
        await _mediator.Send(new RemoveUsersFromGroupChatCommand(Context.ToAuthUser(), request));
    }

    public async Task InviteUsersToGroupChat(InviteUsersToGroupChatRequest request)
    {
        await _mediator.Send(new InviteUsersToGroupChatCommand(Context.ToAuthUser(), request));
    }

    public async Task GetMessagesWithUser(string recipientId)
    {
        await _mediator.Send(new GetMessagesWithUserQuery(Context.ToAuthUser(), recipientId));
    }

    public async Task GetGroupChatMessages(string groupChatId)
    {
        await _mediator.Send(new GetGroupChatMessagesQuery(Context.ToAuthUser(), groupChatId));
    }

    public async Task SendMessageToUser(SendMessageRequest request)
    {
        await _mediator.Send(new SendMessageToUserCommand(Context.ToAuthUser(), request));
    }

    public async Task SendMessageToGroupChat(SendGroupChatMessageRequest request)
    {
        await _mediator.Send(new SendMessageToGroupChatCommand(Context.ToAuthUser(), request));
    }
}
