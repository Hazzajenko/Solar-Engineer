using System.Text.Json.Serialization;

namespace Identity.Domain;

public class AppUserConnection
{
    public AppUserConnection(Guid appUserId, string connectionId)
    {
        AppUserId = appUserId;
        Connections = new List<SocketConnection> { new(connectionId) };
    }

    public Guid AppUserId { get; set; }
    public DateTime InitialConnectedTime { get; set; } = DateTime.Now;

    [JsonIgnore]
    public List<SocketConnection> Connections { get; set; }
}

public class SocketConnection
{
    public SocketConnection(string connectionId)
    {
        ConnectionId = connectionId;
    }

    public DateTime ConnectedTime { get; set; } = DateTime.Now;
    public string ConnectionId { get; set; }
}
