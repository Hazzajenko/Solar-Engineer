using ApplicationCore.Entities;
using Identity.Application.Data.UnitOfWork;
using Identity.Application.Services.Connections;
using Identity.Contracts.Data;
using Identity.Contracts.Responses.Connections;
using Identity.Domain;
using Identity.SignalR.Commands.Connections;
using Identity.SignalR.Hubs;
using Infrastructure.SignalR;
using Mediator;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;

namespace Identity.Application.Handlers.Connections;

public class OnDisconnectedHandler : ICommandHandler<OnDisconnectedCommand, bool>
{
    private readonly IConnectionsService _connections;
    private readonly IHubContext<UsersHub, IUsersHub> _hubContext;
    private readonly ILogger<OnDisconnectedHandler> _logger;

    public OnDisconnectedHandler(
        ILogger<OnDisconnectedHandler> logger,
        IHubContext<UsersHub, IUsersHub> hubContext,
        IConnectionsService connections
    )
    {
        _logger = logger;
        _hubContext = hubContext;
        _connections = connections;
    }

    public async ValueTask<bool> Handle(OnDisconnectedCommand command, CancellationToken cT)
    {
        AuthUser authUser = command.AuthUser;
        Guid userId = authUser.Id;
        var userConnections = _connections.GetConnections(userId);

        if (userConnections.Any() is false)
        {
            _logger.LogWarning(
                "User {UserName} disconnected with no active connections",
                authUser.UserName
            );
            return true;
        }

        _connections.Remove(userId, command.AuthUser.ConnectionId!);

        var existingConnections = _connections.GetConnections(userId);
        if (existingConnections.Any())
        {
            var connectionsCount = existingConnections.Count();
            _logger.LogInformation(
                "User {UserName} disconnected with ConnectionId: {ConnectionId}. Remaining connections: {ConnectionsCount}",
                authUser.UserName,
                command.AuthUser.ConnectionId,
                connectionsCount
            );
            return true;
        }

        var userIsOfflineResponse = new UserIsOfflineResponse { AppUserId = userId.ToString() };

        await _hubContext.Clients.AllExcept(userId.ToString()).UserIsOffline(userIsOfflineResponse);

        _logger.LogInformation("User {UserName} disconnected", authUser.UserName);

        return true;
    }
}
