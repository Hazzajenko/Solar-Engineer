namespace dotnetapi.SignalR.Connections;

public class AnonConnections
{
    private static readonly Dictionary<string, List<string>> OnlineUsers = new();


    public Task<bool> UserConnected(string username, string connectionId)
    {
        var isOnline = false;
        lock (OnlineUsers)
        {
            if (OnlineUsers.ContainsKey(username))
            {
                OnlineUsers[username].Add(connectionId);
            }
            else
            {
                OnlineUsers.Add(username, new List<string> { connectionId });
                isOnline = true;
            }
        }

        return Task.FromResult(isOnline);
    }
}