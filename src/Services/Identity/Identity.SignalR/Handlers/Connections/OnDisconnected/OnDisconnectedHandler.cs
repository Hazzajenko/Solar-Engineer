using Identity.Contracts.Data;
using Identity.SignalR.Handlers.Connections.OnConnected;
using Identity.SignalR.Hubs;
using Identity.SignalR.Services;
using Mediator;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;

namespace Identity.SignalR.Handlers.Connections.OnDisconnected;

public class OnDisconnectedHandler : ICommandHandler<OnConnectedCommand, bool>
{
    private readonly ConnectionsService _connections;
    private readonly IHubContext<ConnectionsHub, IConnectionsHub> _hubContext;
    private readonly ILogger<OnDisconnectedHandler> _logger;

    public OnDisconnectedHandler(
        ILogger<OnDisconnectedHandler> logger,
        IHubContext<ConnectionsHub, IConnectionsHub> hubContext,
        ConnectionsService connections
    )
    {
        _logger = logger;
        _hubContext = hubContext;
        _connections = connections;
    }

    public async ValueTask<bool> Handle(OnConnectedCommand request, CancellationToken cT)
    {
        var userId = request.User.Id;
        var userConnections = _connections.GetConnections(userId);

        if (userConnections.Any())
            return true;

        _connections.Remove(userId, request.User.ConnectionId);

        var existingConnections = _connections.GetConnections(userId);
        if (existingConnections.Any())
            return true;

        var userConnection = new ConnectionDto { UserId = userId.ToString() };

        await _hubContext.Clients.AllExcept(userId.ToString()).UserIsOffline(userConnection);

        _logger.LogInformation("User {U} disconnected", userId);

        return true;
    }
}