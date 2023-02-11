using System.Security.Claims;

namespace Auth.API.Extensions;

public static class ClaimsPrincipleExtensions
{
    public static ProviderLogin GetProviderLogin(this ClaimsPrincipal user)
    {
        var identity = user.Identity?.Name?.Split('|');
        if (identity is null) throw new ArgumentNullException(nameof(user), "identity is null");

        var loginProvider = identity[0];
        var providerKey = identity[1];
        return new ProviderLogin { LoginProvider = loginProvider, ProviderKey = providerKey };
    }

    public static string GetIdentity(this ClaimsPrincipal user)
    {
        var identity = user.Identity?.Name;
        if (identity is null) throw new ArgumentNullException(nameof(user), "identity is null");

        return identity;
    }

    public static int GetUserId(this ClaimsPrincipal user)
    {
        var value = user.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (value == null)
            throw new ArgumentNullException(nameof(user));
        return int.Parse(value);
    }
}