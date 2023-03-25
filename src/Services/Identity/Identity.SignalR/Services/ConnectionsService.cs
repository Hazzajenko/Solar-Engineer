namespace Identity.SignalR.Services;

public class ConnectionsService
{
    private readonly Dictionary<Guid, HashSet<string>> _connections = new();

    // ReSharper disable once InconsistentlySynchronizedField
    public int Count => _connections.Count;

    public void Add(Guid key, string connectionId)
    {
        lock (_connections)
        {
            // HashSet<string> connections;
            if (!_connections.TryGetValue(key, out var connections))
            {
                connections = new HashSet<string>();
                _connections.Add(key, connections);
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
                    _connections.Remove(key);
            }
        }
    }
}