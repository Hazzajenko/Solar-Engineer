using System.Globalization;
using System.Security.Claims;
using Duende.IdentityServer.Models;
using Identity.API.Models;
using IdentityModel.AspNetCore.AccessTokenManagement;
using Infrastructure.Authentication;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace Identity.API.Extensions;

public static class ClaimsPrincipleExtensions
{
    public static string GetUserId(this ClaimsPrincipal user)
    {
        var value = user.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (value == null)
            throw new ArgumentNullException(nameof(user));
        return value;
    }

    public static UserAccessToken GetUserAccessToken(this AuthenticateResult result)
    {
        var accessToken = result.Properties?.Items.SingleOrDefault(x => x.Key.Equals(".Token.access_token")).Value;
        var expiresAt = result.Properties?.Items.SingleOrDefault(x => x.Key.Equals(".Token.expires_at")).Value;
        DateTimeOffset? dtExpires = null;
        if (expiresAt != null) dtExpires = DateTimeOffset.Parse(expiresAt, CultureInfo.InvariantCulture);

        return new UserAccessToken
        {
            AccessToken = accessToken,
            Expiration = dtExpires!
        };
    }

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

    public static bool IsNativeClient(this AuthorizationRequest context)
    {
        return !context.RedirectUri.StartsWith("https", StringComparison.Ordinal)
               && !context.RedirectUri.StartsWith("http", StringComparison.Ordinal);
    }

    public static IActionResult LoadingPage(this PageModel page, string redirectUri)
    {
        page.HttpContext.Response.StatusCode = 200;
        page.HttpContext.Response.Headers["Location"] = "";

        return page.RedirectToPage("/Redirect/Index", new { RedirectUri = redirectUri });
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