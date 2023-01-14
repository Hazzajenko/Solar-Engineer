using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;

namespace dotnetapi.Models.SignalR;

/*
public class UserConnection
{
    public int Id { get; set; }

    public string Username { get; set; } = default!;
    public DateTime LoggedOn { get; set; } = DateTime.Now;

    public List<ConnectionId> ConnectionIds { get; set; } = default!;
    // public ConnectionId[] ConnectionIds { get; set; }
}

public class ConnectionId
{
    public string Id { get; set; } = default!;
    public int UserConnectionId { get; set; }
    public UserConnection UserConnection { get; set; } = default!;
}*/

[PrimaryKey(nameof(UserId))]
public class UserConnection
{
    [Key] public int UserId { get; set; }
    public string Username { get; set; } = default!;
    public DateTime LoggedOn { get; set; } = DateTime.Now;
    public List<WebConnection> Connections { get; set; } = new();
}

public class WebConnection
{
    [Key] public int Id { get; set; }
    public int UserId { get; set; }
    public UserConnection User { get; set; } = default!;
    public string ConnectionId { get; set; } = default!;
}