using FastEndpoints;
using Identity.Application.Entities;
using Identity.Application.Handlers.AppUsers.GetAppUserDto;
using Identity.Application.Handlers.Auth.Authorize;
using Identity.Application.Handlers.Auth.Token;
using Identity.Contracts.Responses;
using Infrastructure.Extensions;
using Mediator;
using Microsoft.AspNetCore.Identity;

// using GetTokenCommand = Identity.API.Handlers.GetTokenCommand;

namespace Identity.API.Endpoints;

public class AuthorizeEndpoint : EndpointWithoutRequest<AuthorizeResponse>
{
    private readonly IMediator _mediator;
    private readonly UserManager<AppUser> _userManager;

    public AuthorizeEndpoint(IMediator mediator, UserManager<AppUser> userManager)
    {
        _mediator = mediator;
        _userManager = userManager;
    }

    public override void Configure()
    {
        Post("/authorize");
        AuthSchemes(IdentityConstants.ExternalScheme);
    }

    public override async Task HandleAsync(CancellationToken cT)
    {
        var appUser = await _mediator.Send(new AuthorizeCommand(HttpContext), cT);
        var token = await _mediator.Send(new GetTokenCommand(appUser.Id, appUser.UserName), cT);

        var storedToken = await _userManager.GetAuthenticationTokenAsync(
            appUser,
            "google",
            "token"
        );
        if (storedToken is not null)
        {
            var removeTokenResult = await _userManager.RemoveAuthenticationTokenAsync(
                appUser,
                "google",
                "token"
            );
        }

        var tokenResult = await _userManager.SetAuthenticationTokenAsync(
            appUser,
            "google",
            "token",
            token
        );
        if (!tokenResult.Succeeded)
            foreach (var tokenResultError in tokenResult.Errors)
                Logger.LogError("{@E}", tokenResultError);

        var user = await _mediator.Send(new GetAppUserDtoQuery(User), cT);
        if (user is null)
        {
            Logger.LogError("Unable to find user {UserId}", User.GetUserId());
            await SendUnauthorizedAsync(cT);
            return;
        }
        
        Response.Token = token;
        Response.User = user;

        await SendOkAsync(Response, cT);
    }
}