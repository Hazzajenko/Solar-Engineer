﻿using Infrastructure.Common;

namespace Identity.SignalR.Entities;

public class UserConnection : IEntity
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
}