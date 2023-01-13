namespace dotnetapi.SignalR;

public static class ConnectionsManager
{
    private static readonly Dictionary<string, string> ConnectionsDictionary = new();

    public static string GetConnection(string key)
    {
        if (ConnectionsDictionary.TryGetValue(key!, out var connectionId))
            return connectionId;
        return string.Empty;
    }

    public static void AddConnection(string key, string connectionId)
    {
        if (!ConnectionsDictionary.ContainsKey(key))
            ConnectionsDictionary.Add(key, connectionId);
        else
            ConnectionsDictionary[key] = connectionId;
    }
}