using Identity.SignalR.Handlers.Connections.OnConnected;
using Identity.SignalR.Handlers.Connections.OnDisconnected;
using Infrastructure.SignalR;
using Mediator;
using Microsoft.AspNetCore.SignalR;

namespace Identity.SignalR.Hubs;

public class ConnectionsHub : Hub<IConnectionsHub>
{
    private readonly IMediator _mediator;

    public ConnectionsHub(IMediator mediator)
    {
        _mediator = mediator;
    }

    public override async Task OnConnectedAsync()
    {
        await _mediator.Send(new OnConnectedCommand(Context.ToHubAppUser()));

        await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        await _mediator.Send(new OnDisconnectedCommand(Context.ToHubAppUser()));

        await base.OnDisconnectedAsync(exception);
    }
}