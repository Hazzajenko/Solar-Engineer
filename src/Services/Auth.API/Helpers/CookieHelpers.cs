using System.Security.Claims;
using Auth.API.Entities;
using Auth.API.Repositories;
using Infrastructure.Extensions;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.IdentityModel.JsonWebTokens;

namespace Auth.API.Helpers;

public static class CookieHelpers
{
    public static async Task ValidateAsync(CookieValidatePrincipalContext context)
    {
        ArgumentNullException.ThrowIfNull(context);
        if (context.Principal is null)
        {
            context.RejectPrincipal();
            return;
        }

        var userId = context.Principal.Claims.FirstOrDefault(claim => claim.Type == ClaimTypes.NameIdentifier)?.Value;
        if (userId == null)
        {
            context.RejectPrincipal();
            return;
        }

        var appUserRepository = context.HttpContext.RequestServices.GetRequiredService<IAppUserRepository>();
        var user = await appUserRepository.GetByIdAsync(userId.ToGuid());
        if (user == null) context.RejectPrincipal();
    }


    public static async Task SignInAppUserAsync(this HttpContext context, AuthUser authUser)
    {
        var newAppUserClaims = new List<Claim>
        {
            new(JwtRegisteredClaimNames.Sub, authUser.Id.ToString()),
            new(JwtRegisteredClaimNames.UniqueName, authUser.UserName!)
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