using ApplicationCore.Extensions;
using FastEndpoints;
using Identity.Application.Commands;
using Identity.Application.Logging;
using Identity.Application.Mapping;
using Identity.Application.Queries.AppUsers;
using Identity.Application.Services.Jwt;
using Identity.Contracts.Data;
using Identity.Contracts.Responses;
using Identity.Domain;
using Infrastructure.Extensions;
using Mediator;
using Microsoft.AspNetCore.Identity;

namespace Identity.API.Endpoints.Auth;

public class AuthorizeEndpoint : EndpointWithoutRequest<AuthorizeResponse>
{
    private readonly IJwtTokenGenerator _jwtTokenGenerator;
    private readonly IMediator _mediator;
    private readonly UserManager<AppUser> _userManager;

    public AuthorizeEndpoint(
        IMediator mediator,
        UserManager<AppUser> userManager,
        IJwtTokenGenerator jwtTokenGenerator
    )
    {
        _mediator = mediator;
        _userManager = userManager;
        _jwtTokenGenerator = jwtTokenGenerator;
    }

    public override void Configure()
    {
        Post("/authorize");
        AuthSchemes(IdentityConstants.ExternalScheme);
        Summary(x =>
        {
            x.Summary = "Authorize user";
            x.Description = "Authorize user";
            x.Response<AuthorizeResponse>(200, "Success");
            x.Response(401, "Unauthorized");
        });
    }

    public override async Task HandleAsync(CancellationToken cT)
    {
        ExternalSigninResponse externalSigninResponse = await _mediator.Send(
            new AuthorizeCommand(HttpContext),
            cT
        );
        AppUser appUser = externalSigninResponse.AppUser;
        var loginProvider = externalSigninResponse.LoginProvider;

        var token = _jwtTokenGenerator.GenerateToken(appUser.Id.ToString(), appUser.UserName);

        var storedToken = await _userManager.GetAuthenticationTokenAsync(
            appUser,
            loginProvider,
            "token"
        );
        if (storedToken is not null)
            await _userManager.RemoveAuthenticationTokenAsync(appUser, loginProvider, "token");

        IdentityResult tokenResult = await _userManager.SetAuthenticationTokenAsync(
            appUser,
            loginProvider,
            "token",
            token
        );
        if (!tokenResult.Succeeded)
            foreach (IdentityError tokenResultError in tokenResult.Errors)
                Logger.LogError("{@E}", tokenResultError);

        AppUserDto? user = await _mediator.Send(new GetAppUserDtoByIdQuery(appUser.Id), cT);
        if (user is null)
        {
            Logger.LogUserNotFound(appUser.Id.ToString(), appUser.UserName);
            await SendUnauthorizedAsync(cT);
            return;
        }

        Logger.LogInformation(
            "User {UserName}: Authenticated in with {LoginProvider}",
            user.UserName,
            loginProvider
        );

        Response.Token = token;
        Response.User = user;

        await SendOkAsync(Response, cT);
    }
}
