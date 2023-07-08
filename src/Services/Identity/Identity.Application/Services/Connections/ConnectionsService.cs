using Identity.Application.OpenTelemetry;
using Identity.Contracts.Data;
using Identity.Domain;
using Infrastructure.Logging;
using Infrastructure.OpenTelemetry;
using Infrastructure.SignalR;
using Microsoft.Extensions.Logging;
using OpenTelemetry.Metrics;
using Serilog;

namespace Identity.Application.Services.Connections;

public class ConnectionsService : IConnectionsService
{
    private readonly Dictionary<Guid, AppUserConnectionDto> _connections = new();

    public int ConnectedUsersCount { get; private set; } = 0;
    private readonly ILogger<ConnectionsService> _logger;

    public ConnectionsService(ILogger<ConnectionsService> logger)
    {
        _logger = logger;
    }

    public void Add(Guid appUserId, string connectionId)
    {
        AppUserConnectionDto userConnection;

        lock (_connections)
        {
            if (_connections.TryGetValue(appUserId, out userConnection!))
            {
                userConnection.Connections.Add(new SocketConnection(connectionId));
                _logger.LogInformation(
                    "User {AppUserId} has {ConnectionsCount} connections",
                    appUserId,
                    userConnection.Connections.Count
                );
                return;
            }

            userConnection = new AppUserConnectionDto(appUserId, connectionId);
            _connections.Add(appUserId, userConnection);

            ConnectedUsersCount++;

            var actionKeyValuePair = new KeyValuePair<string, object?>("Action", nameof(Add));
            var connectionCountKeyValuePair = new KeyValuePair<string, object?>(
                "ConnectionsCount",
                ConnectedUsersCount
            );
            IdentityDiagnosticsConfig.SignalRConnectionCounter.Add(
                1,
                actionKeyValuePair,
                connectionCountKeyValuePair
            );
        }

        lock (userConnection)
        {
            userConnection.Connections.Add(new SocketConnection(connectionId));
        }
    }

    public AppUserConnectionDto? GetAppUserConnectionByAppUserId(Guid appUserId)
    {
        AppUserConnectionDto? userConnection;
        _connections.TryGetValue(appUserId, out userConnection);
        return userConnection;
    }

    public bool UpdateLastActiveTime(Guid appUserId)
    {
        AppUserConnectionDto? appUserConnection = GetAppUserConnectionByAppUserId(appUserId);
        if (appUserConnection is not null)
        {
            appUserConnection.LastActiveTime = DateTime.UtcNow;
            return true;
        }

        Log.Logger.Error("UserConnection is null, AppUserId: {AppUserId}", appUserId);
        return false;
    }

    public bool AddDeviceInfoToUserIdAndConnectionId(
        Guid appUserId,
        string connectionId,
        DeviceInfoDto deviceInfo
    )
    {
        AppUserConnectionDto? appUserConnection = GetAppUserConnectionByAppUserId(appUserId);
        if (appUserConnection is not null)
            return appUserConnection.AddDeviceInfoToConnectionId(connectionId, deviceInfo);

        _logger.LogError("UserConnection is null, AppUserId: {AppUserId}", appUserId);
        return false;
    }

    public bool IsUserOnline(Guid appUserId)
    {
        AppUserConnectionDto? appUserConnection = GetAppUserConnectionByAppUserId(appUserId);
        return appUserConnection is not null;
    }

    public DateTime GetLastActiveTime(Guid appUserId)
    {
        AppUserConnectionDto? appUserConnection = GetAppUserConnectionByAppUserId(appUserId);
        if (appUserConnection is not null)
            return appUserConnection.LastActiveTime;

        _logger.LogError("UserConnection is null, AppUserId: {AppUserId}", appUserId);
        return DateTime.MinValue;
    }

    public TimeSpan GetConnectionDurationByAppUserId(Guid appUserId)
    {
        AppUserConnectionDto? appUserConnection = GetAppUserConnectionByAppUserId(appUserId);
        appUserConnection.ThrowHubExceptionIfNull(
            "GetConnectionDuration: AppUserConnection is null",
            appUserId.ToString()
        );
        return DateTime.UtcNow - appUserConnection.InitialConnectedTime;
    }

    public IEnumerable<string> GetConnections(Guid key)
    {
        return _connections.TryGetValue(key, out AppUserConnectionDto? userConnection)
            ? userConnection.Connections.Select(x => x.ConnectionId)
            : Enumerable.Empty<string>();
    }

    public IEnumerable<Guid> GetAllConnectedUserIds()
    {
        return _connections.Keys;
    }

    public IEnumerable<ConnectionDto> GetConnectionsByIds(IEnumerable<Guid> keys)
    {
        return _connections
            .Where(x => keys.Contains(x.Key))
            .Select(x => new ConnectionDto { AppUserId = x.Key.ToString() });
    }

    public IEnumerable<AppUserConnectionDto> GetAllUserConnections()
    {
        return _connections.Values;
    }

    public IEnumerable<AppUserConnectionDto> GetUserConnectionsByIds(IEnumerable<Guid> keys)
    {
        return _connections.Where(x => keys.Contains(x.Key)).Select(x => x.Value);
    }

    public void Remove(Guid appUserId, string connectionId)
    {
        AppUserConnectionDto userConnection;

        lock (_connections)
        {
            if (!_connections.TryGetValue(appUserId, out userConnection!))
                return;
        }

        lock (userConnection)
        {
            userConnection.RemoveConnection(connectionId);

            if (userConnection.IsEmpty())
                return;
        }

        lock (_connections)
        {
            _connections.Remove(appUserId);

            var actionKeyValuePair = new KeyValuePair<string, object?>("Action", nameof(Remove));
            var connectionCountKeyValuePair = new KeyValuePair<string, object?>(
                "ConnectionsCount",
                _connections.Count
            );
            IdentityDiagnosticsConfig.SignalRConnectionCounter.Add(
                -1,
                actionKeyValuePair,
                connectionCountKeyValuePair
            );
        }
    }
}
