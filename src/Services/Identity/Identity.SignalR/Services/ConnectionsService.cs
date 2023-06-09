using Identity.Contracts.Data;
using Identity.Domain;
using Infrastructure.Logging;
using Infrastructure.OpenTelemetry;

namespace Identity.SignalR.Services;

public class ConnectionsService
{
    private readonly Dictionary<Guid, AppUserConnection> _connections = new();

    // private readonly Dictionary<Guid, HashSet<string>> _connections = new();
    public int ConnectedUsersCount => _connections.Count;


    public void Add(Guid appUserId, string connectionId)
    {
        lock (_connections)
        {
            if (!_connections.TryGetValue(appUserId, out var userConnection))
            {
                userConnection = new AppUserConnection(appUserId, connectionId);
                // connections = new HashSet<string>();
                // _connections.Add(appUserId, connections);
                _connections.Keys.DumpObjectJson();

                DiagnosticsConfig.SignalRConnectionCounter.Add(
                    1,
                    new KeyValuePair<string, object?>("Action", nameof(Index)),
                    new KeyValuePair<string, object?>(
                        "ConnectionsCount",
                        nameof(ConnectionsService)
                    )
                );
            }

            lock (userConnection)
            {
                userConnection.Connections.Add(new SocketConnection(connectionId));
                // connections.Add(connectionId);
            }
        }
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
        return _connections.Where(x => keys.Contains(x.Key)).Select(x => new ConnectionDto
        {
            UserId = x.Key.ToString()
        });
    }

    public IEnumerable<AppUserConnection> GetUserConnectionsByIds(IEnumerable<Guid> keys)
    {
        return _connections.Where(x => keys.Contains(x.Key)).Select(x => x.Value);
    }

    public void Remove(Guid appUserId, string connectionId)
    {
        lock (_connections)
        {
            if (!_connections.TryGetValue(appUserId, out var userConnection))
                return;

            lock (userConnection)
            {
                // userConnection.Connections.Remove(connectionId);
                userConnection.Connections.RemoveAll(x => x.ConnectionId == connectionId);
                // connections.Remove(connectionId);

                if (userConnection.Connections.Count == 0)
                {
                    _connections.Remove(appUserId);
                    DiagnosticsConfig.SignalRConnectionCounter.Add(
                        -1,
                        new KeyValuePair<string, object?>("Action", nameof(Index)),
                        new KeyValuePair<string, object?>(
                            "ConnectionsCount",
                            nameof(ConnectionsService)
                        )
                    );
                }
            }
        }
    }
}