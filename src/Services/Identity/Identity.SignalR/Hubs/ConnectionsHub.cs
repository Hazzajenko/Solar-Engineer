using Identity.SignalR.Handlers.Connections.OnConnected;
using Identity.SignalR.Handlers.Connections.OnDisconnected;
using Infrastructure.SignalR;
using Mediator;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;

namespace Identity.SignalR.Hubs;

public class ConnectionsHub : Hub<IConnectionsHub>
{
    private readonly ILogger<ConnectionsHub> _logger;
    private readonly IMediator _mediator;

    public ConnectionsHub(IMediator mediator, ILogger<ConnectionsHub> logger)
    {
        _mediator = mediator;
        _logger = logger;
    }

    public override async Task OnConnectedAsync()
    {
        _logger.LogInformation("OnConnectedAsync");
        await _mediator.Send(new OnConnectedCommand(Context.ToHubAppUser()));

        await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        _logger.LogInformation("OnDisconnectedAsync");
        await _mediator.Send(new OnDisconnectedCommand(Context.ToHubAppUser()));

        await base.OnDisconnectedAsync(exception);
    }
}