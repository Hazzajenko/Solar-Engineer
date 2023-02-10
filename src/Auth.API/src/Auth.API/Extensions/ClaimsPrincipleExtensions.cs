using System.Security.Claims;

namespace Auth.API.Extensions;

public static class ClaimsPrincipleExtensions
{
    public static ProviderLogin GetProviderLogin(this ClaimsPrincipal user)
    {
        string[]? identity = user.Identity?.Name?.Split('|');
        if (identity is null)
        {
            throw new ArgumentNullException(nameof(user), "identity is null");
        }

        string loginProvider = identity[0];
        string providerKey = identity[1];
        return new ProviderLogin { LoginProvider = loginProvider, ProviderKey = providerKey };
    }

    public static string GetIdentity(this ClaimsPrincipal user)
    {
        string? identity = user.Identity?.Name;
        if (identity is null)
        {
            throw new ArgumentNullException(nameof(user), "identity is null");
        }

        return identity;
    }
}