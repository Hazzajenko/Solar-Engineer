using Infrastructure.Logging;
using Infrastructure.OpenTelemetry;

namespace Identity.SignalR.Services;

public class ConnectionsService
{
    /*private int _Count => _connections.Count;
    public int Count
    {
        get { return _Count; }
        set { }
    }*/
    /*private static readonly Counter<long> SignalRCounter =
        DiagnosticsConfig.SignalRConnectionCounter;*/

    // DiagnosticsConfig.Meter.CreateCounter<int>("app.signalr_connection_counter");

    private readonly Dictionary<Guid, HashSet<string>> _connections = new();

    public int ConnectedUsersCount => _connections.Count;

    /*set =>
            SignalRCounter.Add(
                value,
                new KeyValuePair<string, object?>("ConnectionsCount", nameof(ConnectionsService))
            );*/
    /*DiagnosticsConfig.RequestCounter.Add(
    1,
    new KeyValuePair<string, object?>("Action", nameof(Index)),
    new KeyValuePair<string, object?>("Endpoint", nameof(PingEndpoint))
        );*/


    public void Add(Guid key, string connectionId)
    {
        lock (_connections)
        {
            // HashSet<string> connections;
            if (!_connections.TryGetValue(key, out var connections))
            {
                connections = new HashSet<string>();
                _connections.Add(key, connections);
                _connections.Keys.DumpObjectJson();
                /*DiagnosticsConfig.RequestCounter.Add(
                    1,
                    new KeyValuePair<string, object?>("Action", nameof(Index)),
                    new KeyValuePair<string, object?>("Endpoint", nameof(ConnectionsService))
                );*/

                DiagnosticsConfig.SignalRConnectionCounter.Add(
                    1,
                    new KeyValuePair<string, object?>("Action", nameof(Index)),
                    new KeyValuePair<string, object?>(
                        "ConnectionsCount",
                        nameof(ConnectionsService)
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
            // HashSet<string> connections;
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
                            nameof(ConnectionsService)
                        )
                    );
                    /*DiagnosticsConfig.SignalRConnectionCounter.Add(
                        -1,
                        new KeyValuePair<string, object?>(
                            "ConnectionsCount",
                            nameof(ConnectionsService)
                        )
                    );*/
                }
            }
        }
    }
}