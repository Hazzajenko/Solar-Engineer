using Identity.Contracts.Data;
using Marten;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;

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

        // app.MapPost("/message", ([FromServices] IDbContextOutbox<IdentityContext> outbox))

        /*var loginEndpoints = app.MapGroup("login");

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
                    $"https://api.domain.com/identity/v1/account/external-auth-callback?returnUrl={returnUrl}";#1#
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
        );*/

        app.MapGet(
            "/load/{guid}",
            (string guid, IDocumentSession session) =>
            {
                var user = session.Load<CurrentUserDto>(guid);
                // var user = await session.Query<AppUser>().FirstOrDefaultAsync();
                return Results.Ok(user);
            }
        );

        app.MapGet("/list", (IQuerySession session) => session.Query<CurrentUserDto>().ToList());

        app.MapGet(
            "/create",
            async (IDocumentSession session) =>
            {
                var user = new CurrentUserDto
                {
                    Id = Guid.NewGuid().ToString(),
                    DisplayName = "Solar Engineer",
                    UserName = "solarengineer",
                    FirstName = "Solar",
                    LastName = "Engineer",
                    PhotoUrl = "https://avatars.githubusercontent.com/u/132562?v=4"
                };
                session.Store(user);
                await session.SaveChangesAsync();
                return Results.Ok(user);
            }
        );

        return app;
    }
}