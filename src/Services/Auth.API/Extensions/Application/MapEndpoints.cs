using Microsoft.AspNetCore.Authentication;

namespace Auth.API.Extensions.Application;

public static partial class WebApplicationExtensions
{
    private static WebApplication MapEndpoints(this WebApplication app)
    {
        var loginEndpoints = app.MapGroup("auth/login");

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
            () =>
                Results.Challenge(
                    new AuthenticationProperties
                    {
                        // RedirectUri = "/authorize"
                        RedirectUri = "https://localhost:4200/?authorize=true"
                    },
                    new List<string> { "google" }
                )
        );
        return app;
    }
}