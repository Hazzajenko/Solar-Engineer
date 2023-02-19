using Microsoft.AspNetCore.Authentication;

namespace Identity.API.Extensions.Application;

public static partial class WebApplicationExtensions
{
    public static WebApplication MapEndpoints(this WebApplication app)
    {
        var loginEndpoints = app.MapGroup("identity/login");
        var identityEndpoints = app.MapGroup("identity");

        loginEndpoints.MapGet("/github", () => Results.Challenge(
            new AuthenticationProperties
            {
                RedirectUri = "http://localhost:4200/"
            }, new List<string> { "github" }));

        loginEndpoints.MapGet("/google", () => Results.Challenge(
            new AuthenticationProperties
            {
                RedirectUri = "https://localhost:4200/"
            }, new List<string> { "google" }));

        identityEndpoints.MapGet("/", (HttpContext ctx) =>
        {
            ctx.GetTokenAsync("access_token");
            return ctx.User.Claims.Select(x => new { x.Type, x.Value }).ToList();
        }).RequireAuthorization("ApiScope");
        return app;
    }
}