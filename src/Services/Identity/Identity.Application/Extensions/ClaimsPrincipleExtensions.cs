﻿using System.Security.Claims;
using Identity.Application.Models;
using Infrastructure.Authentication;

namespace Identity.Application.Extensions;

public static class ClaimsPrincipleExtensions
{
    public static ExternalLogin GetLogin(this ClaimsPrincipal user)
    {
        var loginProvider =
            user.Identity?.AuthenticationType ?? user.FindFirst(CustomClaims.LoginProvider)?.Value;
        if (loginProvider is null)
            throw new ArgumentNullException(nameof(loginProvider));

        var providerKey =
            user.FindFirst(ClaimTypes.NameIdentifier)?.Value
            ?? user.FindFirst(CustomClaims.ProviderKey)?.Value
            ?? user.FindFirst("sub")?.Value;
        // var providerKey = user.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (providerKey is null)
            throw new ArgumentNullException(nameof(providerKey));
        return new ExternalLogin { LoginProvider = loginProvider, ProviderKey = providerKey };
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
