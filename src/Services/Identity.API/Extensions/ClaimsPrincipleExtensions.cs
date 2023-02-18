using System.Security.Claims;
using Duende.IdentityServer.Models;
using Identity.API.Models;
using Infrastructure.Authentication;
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