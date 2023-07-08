using ApplicationCore.Entities;
using Identity.Application.Data.UnitOfWork;
using Identity.Application.OpenTelemetry;
using Identity.Application.Services.Connections;
using Identity.Contracts.Data;
using Identity.Contracts.Responses.Connections;
using Identity.Domain;
using Identity.SignalR.Commands.Connections;
using Identity.SignalR.Hubs;
using Infrastructure.OpenTelemetry;
using Infrastructure.SignalR;
using Mediator;
using Microsoft.ApplicationInsights;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;

namespace Identity.Application.Handlers.Connections;

public class OnDisconnectedHandler : ICommandHandler<OnDisconnectedCommand, bool>
{
    private readonly IConnectionsService _connections;
    private readonly IHubContext<UsersHub, IUsersHub> _hubContext;
    private readonly ILogger<OnDisconnectedHandler> _logger;
    private readonly TelemetryClient _telemetryClient;

    public OnDisconnectedHandler(
        ILogger<OnDisconnectedHandler> logger,
        IHubContext<UsersHub, IUsersHub> hubContext,
        IConnectionsService connections,
        TelemetryClient telemetryClient
    )
    {
        _logger = logger;
        _hubContext = hubContext;
        _connections = connections;
        _telemetryClient = telemetryClient;
    }

    public async ValueTask<bool> Handle(OnDisconnectedCommand command, CancellationToken cT)
    {
        AuthUser authUser = command.AuthUser;
        Guid userId = authUser.Id;
        var userConnections = _connections.GetConnections(userId);

        if (userConnections.Any() is false)
        {
            _logger.LogWarning(
                "User {UserName}: Disconnected from UsersHub with no active connections",
                authUser.UserName
            );
            return true;
        }

        TimeSpan connectionDuration = _connections.GetConnectionDurationByAppUserId(userId);
        _connections.Remove(userId, command.AuthUser.ConnectionId!);

        var existingConnections = _connections.GetConnections(userId);
        if (existingConnections.Any())
        {
            var connectionsCount = existingConnections.Count();
            _logger.LogInformation(
                "User {UserName}: Disconnected from UsersHub with ConnectionId: {ConnectionId}. Remaining connections: {ConnectionsCount}",
                authUser.UserName,
                command.AuthUser.ConnectionId,
                connectionsCount
            );
            return true;
        }

        var userIsOfflineResponse = new UserIsOfflineResponse { AppUserId = userId.ToString() };

        await _hubContext.Clients.AllExcept(userId.ToString()).UserIsOffline(userIsOfflineResponse);

        IdentityDiagnosticsConfig.SignalRConnectionDurationHistogram.Record(
            (long)connectionDuration.TotalMilliseconds,
            new KeyValuePair<string, object?>("Action", nameof(OnDisconnectedHandler))
        );

        _logger.LogInformation(
            "User {UserName}: Disconnected from UsersHub. Duration {Duration}",
            authUser.UserName,
            connectionDuration
        );

        _telemetryClient.TrackEventScopedAsUser(
            "User Disconnected from UsersHub",
            authUser,
            new Dictionary<string, string>
            {
                ["ConnectionId"] = command.AuthUser.ConnectionId!,
                ["Duration"] = connectionDuration.ToString()
            }
        );

        return true;
    }
}
