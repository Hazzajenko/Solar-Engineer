using System.Security.Claims;

namespace ApplicationCore.Interfaces;

public interface IHubCallerContext
{
    /// <summary>
    /// Gets the connection ID.
    /// </summary>
    public abstract string ConnectionId { get; }

    /// <summary>
    /// Gets the user identifier.
    /// </summary>
    public abstract string? UserIdentifier { get; }

    /// <summary>
    /// Gets the user.
    /// </summary>
    public abstract ClaimsPrincipal? User { get; }
}
