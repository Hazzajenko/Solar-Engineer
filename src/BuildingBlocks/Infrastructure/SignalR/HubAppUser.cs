namespace Infrastructure.SignalR;

public class HubAppUser
{
    private HubAppUser(Guid id, string connectionId)
    {
        Id = id;
        ConnectionId = connectionId;
    }

    public Guid Id { get; set; }
    public string ConnectionId { get; set; }

    public static HubAppUser Create(Guid id, string connectionId)
    {
        return new HubAppUser(id, connectionId);
    }
}