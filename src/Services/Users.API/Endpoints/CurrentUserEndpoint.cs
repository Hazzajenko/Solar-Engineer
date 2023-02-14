using System.Security.Claims;
using Auth.API;
using FastEndpoints;
using Mediator;
using Microsoft.AspNetCore.Authentication;
using Users.API.Grpc;

namespace Users.API.Endpoints;

public class CurrentUserEndpoint : EndpointWithoutRequest<AppUserResponse>
{
    private readonly IAuthGrpcGrabber _authGrpcGrabber;
    private readonly IMediator _mediator;

    public CurrentUserEndpoint(
        IMediator mediator, IAuthGrpcGrabber authGrpcGrabber)
    {
        _mediator = mediator;
        _authGrpcGrabber = authGrpcGrabber;
    }


    public override void Configure()
    {
        Get("/current");
        // Policies("BeAuthenticated");
        // Roles("Admin");
        // AllowAnonymous();
        // AllowAnonymous();
        // AuthSchemes("JWT_OR_COOKIE");
        // Claims("provider-key");
    }

    public override async Task HandleAsync(CancellationToken cT)
    {
        var cookies = HttpContext.Request.Cookies;
        Logger.LogInformation("Cookies {Cookies}", cookies.Count);
        // CookieAuth.SignInAsync(privileges => privileges.Claims.Add())
        var token = HttpContext.GetTokenAsync("access_token");
        var user = User;
        var userId = user.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        Logger.LogInformation("User {User}", userId);
        // Response = new AppUserResponse();
        Response = await _authGrpcGrabber.GetAppUserById(userId!);

        await SendOkAsync(Response, cT);
        // Response.User = await _mediator.Send(new AuthorizeCommand(HttpContext), cT);
        // await SendOkAsync(Response, cT);
    }
}