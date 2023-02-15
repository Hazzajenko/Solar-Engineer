using System.Security.Claims;

namespace Infrastructure.Extensions;

public static class ClaimsPrincipleExtensions
{
    public static string GetIdentity(this ClaimsPrincipal user)
    {
        var identity = user.Identity?.Name;
        if (identity is null) throw new ArgumentNullException(nameof(user), "identity is null");

        return identity;
    }

    public static string GetUserId(this ClaimsPrincipal user)
    {
        var value = user.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (value == null)
            throw new ArgumentNullException(nameof(user));
        return value;
    }
}