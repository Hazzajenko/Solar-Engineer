using dotnetapi.Mapping;
using dotnetapi.Models.SignalR;

namespace dotnetapi.SignalR;

public class ConnectionsTracker
{
    /*var scope = app.Services.CreateScope();
    var db = scope.ServiceProvider.GetService<AppDbContext>();*/

    private static readonly Dictionary<string, List<string>> OnlineUsers = new();
    private static readonly Dictionary<string, List<string>> OnlineUsersWithId = new();
    private static readonly Dictionary<string, UserConnection> OnlineConnections = new();

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

    public Task<bool> UserConnectedV2(int userId, string username, string connectionId)
    {
        var isOnline = false;
        lock (OnlineConnections)
        {
            /*if (OnlineConnections.ContainsKey(username))
            {
                // var connection = new Connection(connectionId, userId, username);
                OnlineConnections[username].ConnectionIds.Add(connectionId);
            }
            else
            {
                var connection = new Connection
                {
                    UserId = userId,
                    Username = username,
                    LoggedOn = DateTime.Now,
                    ConnectionIds = new List<string> { connectionId }
                };
                // connection.ConnectionIds.Add(connectionId);
                OnlineConnections.Add(username, connection);
                isOnline = true;
            }*/
        }

        return Task.FromResult(isOnline);
    }

    public Task<bool> UserConnectedV3(int userId, string username, string connectionId)
    {
        var isOnline = false;
        lock (OnlineConnections)
        {
            /*if (OnlineConnections.ContainsKey(username))
            {
                // var connection = new Connection(connectionId, userId, username);
                OnlineConnections[username].ConnectionIds.Add(connectionId);
            }
            else
            {
                var connection = new Connection
                {
                    UserId = userId,
                    Username = username,
                    LoggedOn = DateTime.Now,
                    ConnectionIds = new List<string> { connectionId }
                };
                // connection.ConnectionIds.Add(connectionId);
                OnlineConnections.Add(username, connection);
                isOnline = true;
            }*/
        }

        return Task.FromResult(isOnline);
    }

    public Task<bool> UserDisconnected(string username, string connectionId)
    {
        var isOffline = false;
        lock (OnlineUsers)
        {
            if (!OnlineUsers.ContainsKey(username)) return Task.FromResult(isOffline);

            OnlineUsers[username].Remove(connectionId);
            if (OnlineUsers[username].Count == 0)
            {
                OnlineUsers.Remove(username);
                isOffline = true;
            }
        }

        return Task.FromResult(isOffline);
    }

    public Task<string[]> GetOnlineUsers()
    {
        string[] onlineUsers;
        lock (OnlineUsers)
        {
            onlineUsers = OnlineUsers.OrderBy(k => k.Key).Select(k => k.Key).ToArray();
        }

        return Task.FromResult(onlineUsers);
    }

    public Task<IEnumerable<ConnectionDto>> GetOnlineUsersV3()
    {
        UserConnection[] onlineUsers;
        lock (OnlineConnections)
        {
            onlineUsers = OnlineConnections.OrderBy(k => k.Key).Select(k => k.Value).ToArray();
        }

        var result = onlineUsers.Select(x => x.ToDto());

        Console.WriteLine(result);
        return Task.FromResult(result);
    }

    public Task<UserConnection[]> GetOnlineUsersV2()
    {
        UserConnection[] onlineUsers;
        lock (OnlineConnections)
        {
            onlineUsers = OnlineConnections.OrderBy(k => k.Key).Select(k => k.Value).ToArray();
        }

        Console.WriteLine(onlineUsers);
        return Task.FromResult(onlineUsers);
    }

    public Task<List<string>> GetConnectionsForUser(string username)
    {
        List<string> connectionIds;
        lock (OnlineUsers)
        {
            connectionIds = OnlineUsers.GetValueOrDefault(username)!;
        }

        return Task.FromResult(connectionIds);
    }
}