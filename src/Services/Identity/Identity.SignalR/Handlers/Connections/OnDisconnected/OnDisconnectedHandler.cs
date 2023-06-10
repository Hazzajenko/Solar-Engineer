using Identity.Contracts.Data;
using Identity.SignalR.Hubs;
using Identity.SignalR.Services;
using Mediator;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;

namespace Identity.SignalR.Handlers.Connections.OnDisconnected;

public class OnDisconnectedHandler : ICommandHandler<OnDisconnectedCommand, bool>
{
    private readonly ConnectionsService _connections;
    private readonly IHubContext<UsersHub, IUsersHub> _hubContext;
    private readonly ILogger<OnDisconnectedHandler> _logger;

    public OnDisconnectedHandler(
        ILogger<OnDisconnectedHandler> logger,
        IHubContext<UsersHub, IUsersHub> hubContext,
        ConnectionsService connections
    )
    {
        _logger = logger;
        _hubContext = hubContext;
        _connections = connections;
    }

    public async ValueTask<bool> Handle(OnDisconnectedCommand request, CancellationToken cT)
    {
        var userId = request.AuthUser.Id;
        var userConnections = _connections.GetConnections(userId);

        if (userConnections.Any() is false)
            return true;

        _connections.Remove(userId, request.AuthUser.ConnectionId);

        var existingConnections = _connections.GetConnections(userId);
        if (existingConnections.Any())
            return true;

        var userConnection = new ConnectionDto { UserId = userId.ToString() };

        await _hubContext.Clients.AllExcept(userId.ToString()).UserIsOffline(userConnection);

        _logger.LogInformation("User {U} disconnected", userId);

        return true;
    }
}