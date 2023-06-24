using ApplicationCore.Extensions;

namespace ApplicationCore.Entities;

public class AuthUser
{
    private AuthUser(Guid id)
    {
        Id = id;
    }

    private AuthUser(Guid id, string userName, string connectionId)
    {
        Id = id;
        ConnectionId = connectionId;
        UserName = userName;
    }

    public AuthUser() { }

    public Guid Id { get; set; }
    public string UserName { get; set; } = null!;
    public string? ConnectionId { get; set; }

    public static AuthUser Create(Guid id)
    {
        return new AuthUser(id);
    }

    public static AuthUser Create(string id)
    {
        return new AuthUser(id.ToGuid());
    }

    public static AuthUser Create(Guid id, string userName, string connectionId)
    {
        return new AuthUser(id, userName, connectionId);
    }

    public static AuthUser Create(string id, string userName, string connectionId)
    {
        return new AuthUser(id.ToGuid(), userName, connectionId);
    }
}
