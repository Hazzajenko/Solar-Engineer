using Identity.Contracts.Data;
using Identity.SignalR.Hubs;
using Identity.SignalR.Services;
using Mediator;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;

namespace Identity.SignalR.Handlers.Connections.OnConnected;

public class OnConnectedHandler : ICommandHandler<OnConnectedCommand, bool>
{
    private readonly ConnectionsService _connections;
    private readonly IHubContext<ConnectionsHub, IConnectionsHub> _hubContext;
    private readonly ILogger<OnConnectedHandler> _logger;

    public OnConnectedHandler(
        ILogger<OnConnectedHandler> logger,
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
        {
            var connectionIdExists = userConnections.Contains(request.User.ConnectionId);
            if (connectionIdExists)
                return true;
            _connections.Add(userId, request.User.ConnectionId);
            return true;
        }

        _connections.Add(userId, request.User.ConnectionId);

        var newConnection = new ConnectionDto { UserId = userId.ToString() };

        /*var userConnection = new UserConnection
        {
            UserId = userId,
            Connections = new List<WebConnection>
            {
                new() { UserId = userId, ConnectionId = request.User.ConnectionId }
            }
        };*/

        await _hubContext.Clients.AllExcept(userId.ToString()).UserIsOnline(newConnection);

        var allConnections = _connections.GetAllConnectedUserIds();

        var allConnectionsDtoList = allConnections
            .Select(x => new ConnectionDto { UserId = x.ToString() })
            .ToList();

        await _hubContext.Clients.User(userId.ToString()).GetOnlineUsers(allConnectionsDtoList);

        _logger.LogInformation("User {U} connected", userId);

        return true;
    }
}