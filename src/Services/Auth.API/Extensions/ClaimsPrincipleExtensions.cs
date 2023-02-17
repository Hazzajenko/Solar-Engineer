using System.Security.Claims;
using Auth.API.Models;
using Infrastructure.Authentication;

namespace Auth.API.Extensions;

public static class ClaimsPrincipleExtensions
{
    public static ExternalLogin GetLogin(this ClaimsPrincipal user)
    {
        var loginProvider = user.Identity?.AuthenticationType ?? user.FindFirst(CustomClaims.LoginProvider)?.Value;
        if (loginProvider is null) throw new ArgumentNullException(nameof(loginProvider));

        var providerKey = user.FindFirst(ClaimTypes.NameIdentifier)?.Value ??
                          user.FindFirst(CustomClaims.ProviderKey)?.Value;
        // var providerKey = user.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (providerKey is null) throw new ArgumentNullException(nameof(providerKey));
        return new ExternalLogin
        {
            LoginProvider = loginProvider,
            ProviderKey = providerKey
        };
    }

    /*public static ExternalLogin GetLogin(this ClaimsPrincipal user)
    {
        var loginProvider = user.Identity?.AuthenticationType;
        if (loginProvider is null) throw new ArgumentNullException(nameof(loginProvider));
        var providerKey = user.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (providerKey is null) throw new ArgumentNullException(nameof(providerKey));
        return new ExternalLogin
        {
            LoginProvider = loginProvider,
            ProviderKey = providerKey
        };
    }*/
}