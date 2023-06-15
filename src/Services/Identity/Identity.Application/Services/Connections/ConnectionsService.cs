using Identity.Contracts.Data;
using Identity.Domain;
using Infrastructure.Logging;
using Infrastructure.OpenTelemetry;
using Serilog;

namespace Identity.Application.Services.Connections;

public class ConnectionsService
{
    private readonly Dictionary<Guid, AppUserConnectionDto> _connections = new();
    private int _connectedUsersCount = 0;

    public int ConnectedUsersCount => _connectedUsersCount;

    public void Add(Guid appUserId, string connectionId)
    {
        AppUserConnectionDto userConnection;

        lock (_connections)
        {
            if (_connections.TryGetValue(appUserId, out userConnection!))
            {
                userConnection.Connections.Add(new SocketConnection(connectionId));
                Log.Logger.Information(
                    "User {AppUserId} has {ConnectionsCount} connections",
                    appUserId,
                    userConnection.Connections.Count
                );
                return;
            }

            userConnection = new AppUserConnectionDto(appUserId, connectionId);
            _connections.Add(appUserId, userConnection);

            _connectedUsersCount++;

            var actionKeyValuePair = new KeyValuePair<string, object?>("Action", nameof(Add));
            var connectionCountKeyValuePair = new KeyValuePair<string, object?>(
                "ConnectionsCount",
                _connectedUsersCount
            );
            DiagnosticsConfig.SignalRConnectionCounter.Add(
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

    public AppUserConnectionDto? TryGetAppUserConnection(Guid appUserId)
    {
        AppUserConnectionDto? userConnection;
        _connections.TryGetValue(appUserId, out userConnection);
        return userConnection;
    }

    public bool AddDeviceInfoToUserIdAndConnectionId(
        Guid appUserId,
        string connectionId,
        DeviceInfoDto deviceInfo
    )
    {
        var appUserConnection = TryGetAppUserConnection(appUserId);
        if (appUserConnection is not null)
            return appUserConnection.AddDeviceInfoToConnectionId(connectionId, deviceInfo);

        Log.Logger.Error("UserConnection is null, AppUserId: {AppUserId}", appUserId);
        return false;
    }

    public IEnumerable<string> GetConnections(Guid key)
    {
        if (_connections.TryGetValue(key, out var userConnection))
            return userConnection.Connections.Select(x => x.ConnectionId);

        return Enumerable.Empty<string>();
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
            DiagnosticsConfig.SignalRConnectionCounter.Add(
                -1,
                actionKeyValuePair,
                connectionCountKeyValuePair
            );
        }
    }
}
