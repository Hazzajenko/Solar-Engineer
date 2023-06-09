namespace Identity.Domain;

public class AppUserConnection
{
    public AppUserConnection(Guid appUserId, string connectionId)
    {
        AppUserId = appUserId;
        Connections = new List<SocketConnection>
        {
            new(connectionId)
        };
    }

    public Guid AppUserId { get; set; }
    public DateTime InitialConnectedTime { get; set; } = DateTime.Now;

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

/*public class UserConnection : IEntity
{
    public Guid UserId { get; set; }
    public DateTime InitialConnectedTime { get; set; } = DateTime.Now;
    public List<WebConnection> Connections { get; set; } = new();
    public Guid Id { get; set; }
    public DateTime CreatedTime { get; set; } = DateTime.Now;
    public DateTime LastModifiedTime { get; set; } = DateTime.Now;
}

public class WebConnection
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid UserId { get; set; }
    public UserConnection UserConnection { get; set; } = default!;
    public DateTime ConnectedTime { get; set; } = DateTime.Now;
    public string ConnectionId { get; set; } = default!;
}*/