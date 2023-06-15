using System.Text.Json.Serialization;

namespace Identity.Contracts.Data;

public class AppUserConnectionDto
{
    public AppUserConnectionDto(Guid appUserId, string connectionId)
    {
        AppUserId = appUserId;
        Connections = new List<SocketConnection> { new(connectionId) };
    }

    public Guid AppUserId { get; set; }
    public DateTime InitialConnectedTime { get; set; } = DateTime.UtcNow;
    public DateTime LastActiveTime { get; set; } = DateTime.UtcNow;
    public DeviceInfoDto LatestDeviceInfo { get; set; } = new();

    [JsonIgnore]
    public List<SocketConnection> Connections { get; set; }

    public void AddConnection(string connectionId)
    {
        Connections.Add(new SocketConnection(connectionId));
    }

    public void RemoveConnection(string connectionId)
    {
        Connections.RemoveAll(x => x.ConnectionId == connectionId);
    }

    public bool IsEmpty()
    {
        return Connections.Count == 0;
    }

    public bool AddDeviceInfoToConnectionId(string connectionId, DeviceInfoDto deviceInfo)
    {
        var connection = Connections.FirstOrDefault(x => x.ConnectionId == connectionId);
        if (connection is not null)
        {
            connection.DeviceInfo = deviceInfo;
        }
        LatestDeviceInfo = deviceInfo;
        return connection is not null;
    }
}

public class SocketConnection
{
    public SocketConnection(string connectionId)
    {
        ConnectionId = connectionId;
    }

    public DateTime ConnectedTime { get; set; } = DateTime.UtcNow;
    public DeviceInfoDto DeviceInfo { get; set; } = new();
    public string ConnectionId { get; set; }
}
