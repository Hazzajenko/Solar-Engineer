namespace Projects.API.Hubs;

public class ConnectionMapping<T>
    where T : notnull
{
    private readonly Dictionary<T, HashSet<string>> _connections = new();

    // ReSharper disable once InconsistentlySynchronizedField
    public int Count => _connections.Count;

    public void Add(T key, string connectionId)
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

    public IEnumerable<string> GetConnections(T key)
    {
        // HashSet<string> connections;

        // ReSharper disable once InconsistentlySynchronizedField
        if (_connections.TryGetValue(key, out var connections))
            return connections;

        return Enumerable.Empty<string>();
    }

    public void Remove(T key, string connectionId)
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