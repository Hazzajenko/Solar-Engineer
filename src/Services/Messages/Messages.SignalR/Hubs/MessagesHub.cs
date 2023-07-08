using ApplicationCore.Extensions;
using Infrastructure.SignalR;
using Mediator;
using Messages.Contracts.Requests;
using Messages.SignalR.Commands.GroupChats;
using Messages.SignalR.Queries.GroupChats;
using Messages.SignalR.Queries.Messages;
using Messages.SignalR.Queries.UserMessages;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;

namespace Messages.SignalR.Hubs;

public class MessagesHub : Hub<IMessagesHub>
{
    private readonly IMediator _mediator;
    private readonly ILogger<MessagesHub> _logger;

    public MessagesHub(IMediator mediator, ILogger<MessagesHub> logger)
    {
        _mediator = mediator;
        _logger = logger;
    }

    public override async Task OnConnectedAsync()
    {
        var user = Context.ToAuthUser();
        _logger.LogInformation(
            "Connected: {ConnectionId} - {UserId} - {UserName}",
            Context.ConnectionId,
            user.Id,
            user.UserName
        );
        await _mediator.Send(new GetLatestMessagesQuery(user));
        await _mediator.Send(new GetLatestUserMessagesQuery(user));
        await _mediator.Send(new GetLatestGroupChatMessagesQuery(user));
        await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        var user = Context.ToAuthUser();
        _logger.LogInformation(
            "Disconnected: {ConnectionId} - {UserId} - {UserName}",
            Context.ConnectionId,
            user.Id,
            user.UserName
        );
        await base.OnDisconnectedAsync(exception);
    }

    public async Task RemoveUsersFromGroupChat(RemoveUsersFromGroupChatRequest request)
    {
        await _mediator.Send(new RemoveUsersFromGroupChatCommand(Context.ToAuthUser(), request));
    }

    public async Task InviteUsersToGroupChat(InviteUsersToGroupChatRequest request)
    {
        await _mediator.Send(new InviteUsersToGroupChatCommand(Context.ToAuthUser(), request));
    }

    public async Task GetMessagesWithUser(GetMessagesWithUserRequest request)
    {
        await _mediator.Send(new GetMessagesWithUserQuery(Context.ToAuthUser(), request));
    }

    public async Task GetGroupChatMessages(GetGroupChatMessagesRequest request)
    {
        await _mediator.Send(new GetGroupChatMessagesQuery(Context.ToAuthUser(), request));
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
