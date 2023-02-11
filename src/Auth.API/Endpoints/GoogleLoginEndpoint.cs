using Mediator;
using Microsoft.AspNetCore.Authentication;

namespace Auth.API.Endpoints;

// [Authorize]
public class GoogleLoginEndpoint : EndpointWithoutRequest<IResult>
{
    private readonly IMediator _mediator;

    public GoogleLoginEndpoint(
        IMediator mediator)
    {
        _mediator = mediator;
    }


    public override void Configure()
    {
        Get("/login/google");
        AuthSchemes("google");
        AllowAnonymous();
        // Options(b => b.RequireCors(x => x.AllowAnyOrigin()));
        // PermissionsAll("read:current_user");
    }

    public override async Task HandleAsync(CancellationToken cT)
    {
        await SendOkAsync(Results.Challenge(
            new AuthenticationProperties
            {
                RedirectUri = "http://localhost:4200/"
            }, new List<string> { "google" }), cT);
        /*Logger.LogInformation("BaseUrl {Base}", BaseURL);
        var result = Results.Challenge(
            new AuthenticationProperties
            {
                RedirectUri = "http://localhost:4200/"
            }, new List<string> { "google" });
        var apiResult = result.ApiResult();
        // var idk = result.();
        Logger.LogInformation("ApiResult {ApiResult}", apiResult);
        Response = Results.Challenge(
            new AuthenticationProperties
            {
                RedirectUri = "http://localhost:4200/"
            }, new List<string> { "google" });

        // await SendStringAsync(hi.ToString()!, cancellation: cT);

        await SendRedirectAsync(Response, cT);*/
    }
}