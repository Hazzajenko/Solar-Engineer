using FastEndpoints;
using Identity.Application.Handlers.AppUsers.GetAppUserDto;
using Identity.Application.Handlers.Auth.Authorize;
using Identity.Application.Services.Jwt;
using Identity.Contracts.Responses;
using Identity.Domain.Auth;
using Infrastructure.Extensions;
using Mediator;
using Microsoft.AspNetCore.Identity;

// using GetTokenCommand = Identity.API.Handlers.GetTokenCommand;

namespace Identity.API.Endpoints.Auth;

public class AuthorizeEndpoint : EndpointWithoutRequest<AuthorizeResponse>
{
    private readonly IJwtTokenGenerator _jwtTokenGenerator;

    private readonly IMediator _mediator;

    // private readonly IMartenOutbox _outbox;
    // private readonly IDocumentSession _session;
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
        var appUser = await _mediator.Send(new AuthorizeCommand(HttpContext), cT);
        var token = _jwtTokenGenerator.GenerateToken(appUser.Id.ToString(), appUser.UserName);

        var storedToken = await _userManager.GetAuthenticationTokenAsync(
            appUser,
            "google",
            "token"
        );
        if (storedToken is not null)
            await _userManager.RemoveAuthenticationTokenAsync(
                appUser,
                "google",
                "token"
            );

        var tokenResult = await _userManager.SetAuthenticationTokenAsync(
            appUser,
            "google",
            "token",
            token
        );
        if (!tokenResult.Succeeded)
            foreach (var tokenResultError in tokenResult.Errors)
                Logger.LogError("{@E}", tokenResultError);

        var user = await _mediator.Send(new GetAppUserDtoByIdQuery(appUser.Id), cT);
        if (user is null)
        {
            Logger.LogError("Unable to find user {UserId}", User.GetUserId());
            await SendUnauthorizedAsync(cT);
            return;
        }

        /*
        var guidId = Guid.NewGuid();
        var userDto = user.Adapt<UserDto>();
        var appUserCreated = new AppUserCreated(guidId, userDto);
        var appUserEventV2 = new AppUserEventV2(guidId, appUserCreated);*/
        // _session.Store(appUserEventV2);
        // await _outbox.SendAsync(appUserCreated);
        // await _session.SaveChangesAsync(cT);

        Response.Token = token;
        Response.User = user;

        await SendOkAsync(Response, cT);
    }
}