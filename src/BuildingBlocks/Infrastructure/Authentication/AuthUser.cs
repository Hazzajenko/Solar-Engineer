using Infrastructure.Extensions;

namespace Infrastructure.Authentication;

public class AuthUser
{
    private AuthUser(Guid id, string idToString)
    {
        Id = id;
        IdToString = idToString;
    }

    public AuthUser()
    {
    }

    public Guid Id { get; set; }
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
}