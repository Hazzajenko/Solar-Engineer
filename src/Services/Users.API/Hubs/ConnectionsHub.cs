using Mediator;
using Microsoft.AspNetCore.SignalR;
using Users.API.Handlers.Connections;

namespace Users.API.Hubs;

public class ConnectionsHub : Hub<IConnectionsHub>
{
    private readonly IMediator _mediator;

    public ConnectionsHub(
        IMediator mediator)
    {
        _mediator = mediator;
    }

    public override async Task OnConnectedAsync()
    {
        await _mediator.Send(new OnConnectedAsyncCommand(Context));

        await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        await _mediator.Send(new OnDisconnectedAsyncCommand(Context));

        await base.OnDisconnectedAsync(exception);
    }
}