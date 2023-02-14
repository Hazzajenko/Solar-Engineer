using System.Security.Claims;
using Auth.API.Models;

namespace Auth.API.Extensions;

public static class ClaimsPrincipleExtensions
{
    public static ExternalLogin GetLogin(this ClaimsPrincipal user)
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
    }
}
