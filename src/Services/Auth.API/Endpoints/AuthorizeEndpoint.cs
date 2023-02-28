using Auth.API.Contracts.Responses;
using Auth.API.Entities;
using Auth.API.Handlers;
using FastEndpoints;
using Mediator;
using Microsoft.AspNetCore.Identity;

namespace Auth.API.Endpoints;

public class AuthorizeEndpoint : EndpointWithoutRequest<AuthorizeResponse>
{
    private readonly IMediator _mediator;
    private readonly UserManager<AuthUser> _userManager;

    public AuthorizeEndpoint(
        IMediator mediator, UserManager<AuthUser> userManager)
    {
        _mediator = mediator;
        _userManager = userManager;
    }


    public override void Configure()
    {
        Post("/authorize");
        AuthSchemes(IdentityConstants.ExternalScheme);
        // AuthSchemes("google");
        // AuthSchemes(CookieAuthenticationDefaults.AuthenticationScheme);
    }

    public override async Task HandleAsync(CancellationToken cT)
    {
        // var info = await _signInManager.GetExternalLoginInfoAsync();
        var appUser = await _mediator.Send(new AuthorizeCommand(HttpContext), cT);
        var token = await _mediator.Send(new GetTokenCommand(appUser.Id), cT);
        Response.Token = token;
        // await Send
        // await _signInManager.
        var tokenResult = await _userManager.SetAuthenticationTokenAsync(appUser, "google", "token", token);
        if (!tokenResult.Succeeded)
            foreach (var tokenResultError in tokenResult.Errors)
                Logger.LogError("{@E}", tokenResultError);
        await SendOkAsync(Response, cT);
    }
}