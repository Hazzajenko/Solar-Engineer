using ApplicationCore.Entities;
using Identity.Application.Data.UnitOfWork;
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

public class OnConnectedHandler : ICommandHandler<OnConnectedCommand, bool>
{
    private readonly IConnectionsService _connections;
    private readonly IHubContext<UsersHub, IUsersHub> _hubContext;
    private readonly ILogger<OnConnectedHandler> _logger;
    private readonly TelemetryClient _telemetryClient;

    public OnConnectedHandler(
        ILogger<OnConnectedHandler> logger,
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

    public async ValueTask<bool> Handle(OnConnectedCommand command, CancellationToken cT)
    {
        AuthUser user = command.AuthUser;
        Guid userId = user.Id;
        // _telemetryClient.Context.User.Id = userId.ToString();
        var userConnections = _connections.GetConnections(userId);

        if (userConnections.Any())
        {
            var connectionIdExists = userConnections.Contains(command.AuthUser.ConnectionId);
            if (connectionIdExists)
                return true;
            _connections.Add(userId, command.AuthUser.ConnectionId!);
            var connectionsCount = userConnections.Count();
            _logger.LogInformation(
                "User {UserName}: Connected to UsersHub with ConnectionId: {ConnectionId}. Total connections: {ConnectionsCount}",
                user.UserName,
                command.AuthUser.ConnectionId,
                connectionsCount
            );
            return true;
        }

        _connections.Add(userId, command.AuthUser.ConnectionId!);
        _logger.LogInformation(
            "User {UserName}: Connected to UsersHub with ConnectionId: {ConnectionId}",
            user.UserName,
            command.AuthUser.ConnectionId
        );

        var allAppUserConnections = _connections.GetAllUserConnections();

        var getOnlineUsersResponse = new GetOnlineUsersResponse
        {
            OnlineUsers = allAppUserConnections
        };

        await _hubContext.Clients.User(userId.ToString()).GetOnlineUsers(getOnlineUsersResponse);

        _telemetryClient.TrackEventScopedAsUser(
            "User Connected to UsersHub",
            user,
            new Dictionary<string, string> { ["ConnectionId"] = command.AuthUser.ConnectionId! }
        );

        return true;
    }
}
