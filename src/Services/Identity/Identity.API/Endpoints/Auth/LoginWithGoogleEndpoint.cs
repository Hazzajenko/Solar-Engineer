/*using FastEndpoints;
using Identity.Domain.Auth;
using Microsoft.AspNetCore.Identity;

// using GetTokenCommand = Identity.API.Handlers.GetTokenCommand;

namespace Identity.API.Endpoints.Auth;

public class LoginWithGoogleEndpoint : EndpointWithoutRequest
{
    private readonly SignInManager<AppUser> _signInManager;

    public LoginWithGoogleEndpoint(SignInManager<AppUser> userManager)
    {
        _signInManager = userManager;
    }

    public override void Configure()
    {
        Get("/login/google");
        AllowAnonymous();
        Summary(x =>
        {
            x.Summary = "Login with Google";
            x.Description = "Login with Google";
            x.Response(200, "Success");
            x.Response(401, "Unauthorized");
        });
    }

    public override async Task<IResult> HandleAsync(CancellationToken cT)
    {
        var provider = "google";
        var redirectUrl = "https://solarengineer.net/?authorize=true";
        var properties = _signInManager.ConfigureExternalAuthenticationProperties(
            provider,
            redirectUrl
        );
        properties.AllowRefresh = true;
        return Results.Challenge(properties, new List<string> { "google" });
        // await SendAsync(challenge, cancellation: cT);
    }
}*/

