using Infrastructure.Common;

namespace Users.API.Entities;

public class UserConnection : IEntity
{
    public Guid UserId { get; set; }
    public DateTime InitialConnectedTime { get; set; } = DateTime.UtcNow;
    public List<WebConnection> Connections { get; set; } = new();
    public Guid Id { get; set; }
    public DateTime CreatedTime { get; set; } = DateTime.UtcNow;
    public DateTime LastModifiedTime { get; set; } = DateTime.UtcNow;
}

public class WebConnection
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid UserId { get; set; }
    public UserConnection UserConnection { get; set; } = default!;
    public DateTime ConnectedTime { get; set; } = DateTime.UtcNow;
    public string ConnectionId { get; set; } = default!;
}