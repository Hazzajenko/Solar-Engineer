using Infrastructure.Logging;
using Infrastructure.OpenTelemetry;

namespace Projects.SignalR.Services;

public class ProjectsConnectionsService
{

    private readonly Dictionary<Guid, HashSet<string>> _connections = new();
    public int ConnectedUsersCount => _connections.Count;


    public void Add(Guid key, string connectionId)
    {
        lock (_connections)
        {
            if (!_connections.TryGetValue(key, out var connections))
            {
                connections = new HashSet<string>();
                _connections.Add(key, connections);
                _connections.Keys.DumpObjectJson();

                DiagnosticsConfig.SignalRConnectionCounter.Add(
                    1,
                    new KeyValuePair<string, object?>("Action", nameof(Index)),
                    new KeyValuePair<string, object?>(
                        "ConnectionsCount",
                        nameof(ProjectsConnectionsService)
                    )
                );
            }

            lock (connections)
            {
                connections.Add(connectionId);
            }
        }
    }

    public IEnumerable<string> GetConnections(Guid key)
    {
        if (_connections.TryGetValue(key, out var connections))
            return connections;

        return Enumerable.Empty<string>();
    }

    public IEnumerable<Guid> GetAllConnectedUserIds()
    {
        return _connections.Keys;
    }

    public IEnumerable<string> GetAllConnections()
    {
        return _connections.SelectMany(x => x.Value);
    }

    public void Remove(Guid key, string connectionId)
    {
        lock (_connections)
        {
            if (!_connections.TryGetValue(key, out var connections))
                return;

            lock (connections)
            {
                connections.Remove(connectionId);

                if (connections.Count == 0)
                {
                    _connections.Remove(key);
                    DiagnosticsConfig.SignalRConnectionCounter.Add(
                        -1,
                        new KeyValuePair<string, object?>("Action", nameof(Index)),
                        new KeyValuePair<string, object?>(
                            "ConnectionsCount",
                            nameof(ProjectsConnectionsService)
                        )
                    );
                }
            }
        }
    }
}