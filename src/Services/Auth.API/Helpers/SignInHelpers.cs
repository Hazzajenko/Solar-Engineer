using System.Security.Claims;
using Auth.API.Entities;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.IdentityModel.JsonWebTokens;

namespace Auth.API.Helpers;

public static class SignInHelpers
{
    public static async Task SignInAppUserAsync(this HttpContext context, AppUser appUser)
    {
        var newAppUserClaims = new List<Claim>
        {
            new(JwtRegisteredClaimNames.NameId, appUser.Id.ToString()),
            new(JwtRegisteredClaimNames.UniqueName, appUser.UserName!)
        };
        var newAppUserIdentity = new ClaimsIdentity(
            newAppUserClaims, CookieAuthenticationDefaults.AuthenticationScheme);
        await context.SignInAsync(
            CookieAuthenticationDefaults.AuthenticationScheme,
            new ClaimsPrincipal(newAppUserIdentity), new AuthenticationProperties
            {
                IsPersistent = true
            }
        );
    }
}