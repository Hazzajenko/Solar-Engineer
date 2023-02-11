using System.Security.Claims;
using Auth.API.Repositories;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;

// using System.ArgumentNullException;

namespace Auth.API.Helpers;

public static class PrincipalValidator
{
    public static async Task ValidateAsync(CookieValidatePrincipalContext context)
    {
        if (context == null) throw new ArgumentNullException(nameof(context));

        var userId = context.Principal?.Claims.FirstOrDefault(claim => claim.Type == ClaimTypes.NameIdentifier)?.Value;
        if (userId is null)
        {
            context.RejectPrincipal();
            await context.HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
            return;
        }

        var userRepo = context.HttpContext.RequestServices.GetRequiredService<IAppUserRepository>();
        var user = await userRepo.GetByIdAsync(Convert.ToInt32(userId));
        if (user is null)
        {
            context.RejectPrincipal();
            await context.HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
        }
    }
}