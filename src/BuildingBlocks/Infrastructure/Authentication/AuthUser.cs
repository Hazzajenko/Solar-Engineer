using Infrastructure.Extensions;

namespace Infrastructure.Authentication;

public class AuthUser
{
    private AuthUser(Guid id, string idToString)
    {
        Id = id;
        IdToString = idToString;
    }

    private AuthUser(Guid id, string idToString, bool isSignalR, string connectionId)
    {
        Id = id;
        IdToString = idToString;
        IsSignalR = isSignalR;
        ConnectionId = connectionId;
    }

    public AuthUser()
    {
    }

    public Guid Id { get; set; }
    public bool IsSignalR { get; set; }
    public string? ConnectionId { get; set; }
    private string IdToString { get; } = null!;

    public override string ToString()
    {
        return IdToString;
    }

    public static AuthUser Create(Guid id)
    {
        return new AuthUser(id, id.ToString());
    }

    public static AuthUser Create(string id)
    {
        return new AuthUser(id.ToGuid(), id);
    }

    public static AuthUser Create(Guid id, bool isSignalR, string connectionId)
    {
        return new AuthUser(id, id.ToString(), isSignalR, connectionId);
    }

    public static AuthUser Create(string id, bool isSignalR, string connectionId)
    {
        return new AuthUser(id.ToGuid(), id, isSignalR, connectionId);
    }
}