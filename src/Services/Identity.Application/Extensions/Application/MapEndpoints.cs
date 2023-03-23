using Identity.Domain.Auth;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;

namespace Identity.Application.Extensions.Application;

public static partial class WebApplicationExtensions
{
    private static WebApplication MapEndpoints(this WebApplication app)
    {
        // app.UseHsts();

        app.Use(
            (context, next) =>
            {
                context.Request.Host = new HostString("solarengineer.net");
                context.Request.Scheme = "https";
                return next();
            }
        );

        var loginEndpoints = app.MapGroup("login");

        loginEndpoints.MapGet(
            "/github",
            () =>
                Results.Challenge(
                    new AuthenticationProperties { RedirectUri = "https://localhost:4200/" },
                    new List<string> { "github" }
                )
        );

        loginEndpoints.MapGet(
            "/google",
            (SignInManager<AppUser> signInManager) =>
            {
                var provider = "google";
                /*var returnUrl = "https://solarengineer.net/";
                // var returnUrl = "https://localhost:4200/";
                var redirectUrl =
                    $"https://api.domain.com/identity/v1/account/external-auth-callback?returnUrl={returnUrl}";*/
                // var redirectUrl = "https://solarengineer.net/authorize";
                var redirectUrl = "https://solarengineer.net/?authorize=true";
                var properties = signInManager.ConfigureExternalAuthenticationProperties(
                    provider,
                    redirectUrl
                );
                properties.AllowRefresh = true;
                return Results.Challenge(properties, new List<string> { "google" });
            }
            // Results.Challenge(
            //     new AuthenticationProperties
            //     {
            //         // RedirectUri = "/authorize"
            //         RedirectUri = "https://solarengineer.net/?authorize=true"
            //         // RedirectUri = "https://localhost:4200/?authorize=true"
            //     },
            //     new List<string> { "google" }
            // )
        );
        return app;
    }
}