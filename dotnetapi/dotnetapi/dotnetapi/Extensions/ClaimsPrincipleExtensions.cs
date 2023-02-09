using System.Security.Claims;

namespace dotnetapi.Extensions;

public static class ClaimsPrincipleExtensions
{
    public static string GetUsername(this ClaimsPrincipal user)
    {
        var username = user.FindFirst(ClaimTypes.Name)?.Value;
        if (username == null)
            throw new ArgumentNullException(nameof(user));
        return username;
    }

    public static string GetIdentity(this ClaimsPrincipal user)
    {
        var identity = user.Identity?.Name;
        if (identity is null)
            throw new ArgumentNullException(nameof(user), "identity is null");
        // var identity
        return identity;
    }

    public static ProviderQuery GetProviderQuery(this ClaimsPrincipal user)
    {
        var identity = user.Identity?.Name?.Split('|');
        if (identity is null)
            throw new ArgumentNullException(nameof(user), "identity is null");

        var loginProvider = identity[0];
        var providerKey = identity[1];
        return new ProviderQuery { LoginProvider = loginProvider, ProviderKey = providerKey };
    }

    public static int GetUserId(this ClaimsPrincipal user)
    {
        var value = user.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (value == null)
            throw new ArgumentNullException(nameof(user));
        return int.Parse(value);
    }
}