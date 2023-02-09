using dotnetapi.Extensions;
using dotnetapi.Features.Auth.Contracts.Responses;
using dotnetapi.Features.Auth.Handlers;
using dotnetapi.Features.Auth.Mapping;
using dotnetapi.Models.Entities;
using dotnetapi.Services.Http;
using FastEndpoints;
using Mediator;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;

namespace dotnetapi.Features.Auth.Endpoints;

[Authorize]
public class Auth0LoginEndpoint : EndpointWithoutRequest<AuthLoginResponse>
{
    private readonly IHttpClientFactoryService _httpClientFactoryService;
    private readonly IMediator _mediator;
    private readonly SignInManager<AppUser> _signInManager;
    private readonly UserManager<AppUser> _userManager;

    public Auth0LoginEndpoint(
        UserManager<AppUser> userManager,
        IHttpClientFactoryService httpClientFactoryService,
        IMediator mediator,
        SignInManager<AppUser> signInManager
    )
    {
        _userManager = userManager;
        _httpClientFactoryService = httpClientFactoryService;
        _mediator = mediator;
        _signInManager = signInManager;
    }

    public override void Configure()
    {
        Post("/auth0/login");
        PermissionsAll("read:current_user");
        // AllowAnonymous();PermissionsAll("read:messages");
    }

    public override async Task HandleAsync(CancellationToken cT)
    {
        var providerQuery = User.GetProviderQuery();

        var appUser = await _userManager.FindByLoginAsync(
            providerQuery.LoginProvider,
            providerQuery.ProviderKey
        );

        if (appUser is not null)
        {
            Response.User = appUser.ToCurrentUserDto();
            await SendOkAsync(Response, cT);
            return;
        }

        var identity = User.GetIdentity();
        var auth0User = await _mediator.Send(new GetAuth0UserQuery(identity), cT);
        if (auth0User is null)
        {
            Logger.LogError("Auth0 User {Subject} does not exist", identity);
            ThrowError("Auth0 User does not exist");
        }

        var newAppUser = new AppUser
        {
            UserName = auth0User.UserId,
            FirstName = auth0User.GivenName,
            LastName = auth0User.FamilyName,
            PhotoUrl = auth0User.Picture
        };
        var result = await _userManager.CreateAsync(newAppUser);

        if (!result.Succeeded)
        {
            Logger.LogError("Unable to create user {User}, {@Errors}", identity, result.Errors);
            await SendUnauthorizedAsync(cT);
            return;
        }

        var addLoginResult = await _userManager.AddLoginAsync(
            newAppUser,
            new UserLoginInfo(
                providerQuery.LoginProvider,
                providerQuery.ProviderKey,
                $"{auth0User.GivenName} {auth0User.FamilyName}"
            )
        );

        if (!addLoginResult.Succeeded)
        {
            Logger.LogError(
                "Unable to create addLoginResult {User}, {@Errors}",
                identity,
                result.Errors
            );
            await SendUnauthorizedAsync(cT);
            return;
        }

        Response.User = newAppUser.ToCurrentUserDto();
        await SendOkAsync(Response, cT);
    }
}