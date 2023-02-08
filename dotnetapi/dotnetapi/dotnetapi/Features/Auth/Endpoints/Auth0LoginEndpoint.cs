using System.IdentityModel.Tokens.Jwt;
using dotnetapi.Features.Auth.Handlers;
using dotnetapi.Features.Users.Entities;
using dotnetapi.Models.Entities;
using dotnetapi.Services.Http;
using FastEndpoints;
using Mediator;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;

namespace dotnetapi.Features.Auth.Endpoints;

[Authorize]
public class Auth0LoginEndpoint : EndpointWithoutRequest<Auth0UserDto>
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
        // PermissionsAll("read:messages");
        // AllowAnonymous();PermissionsAll("read:messages");
    }

    public override async Task HandleAsync(CancellationToken cT)
    {
        // var user = User;
        // Logger.LogInformation("USER {@User}", user);
        string authHeader = HttpContext.Request.Headers.Authorization!;
        authHeader = authHeader.Replace("Bearer ", "");

        var token = new JwtSecurityToken(authHeader);
        var sub = token.Subject;

        if (sub.IsNullOrEmpty())
            ThrowError("Invalid sub");

        // string s = "You win some. You lose some.";
        var authUser = await _httpClientFactoryService.GetAuthUser(sub!);

        var subjectSplit = sub.Split('|');
        var loginProvider = subjectSplit[0];
        var providerKey = subjectSplit[1];

        var appUser = await _mediator.Send(
            new GetAppUserByIdentityQuery(loginProvider, providerKey),
            cT
        );
        if (appUser is null)
        {
            var auth0User = await _mediator.Send(new GetAuth0UserQuery(sub), cT);
            if (auth0User is null)
            {
                Logger.LogError("Auth0 User {Subject} does not exist", sub);
                ThrowError("Auth0 User does not exist");
            }

            var newAppUser = new AppUser
            {
                FirstName = auth0User.GivenName,
                LastName = auth0User.FamilyName,
                PhotoUrl = auth0User.Picture
            };
            var result = await _userManager.CreateAsync(newAppUser);
            // result
            // _userManager.

            if (!result.Succeeded)
            {
                Logger.LogError("Unable to create user {User}, {@Errors}", sub, result.Errors);
                await SendUnauthorizedAsync(cT);
                return;
                // return BadRequest(result.Errors);
            }

            // ProviderKey = providerKey,
            // LoginProvider = loginProvider,
            // ProviderDisplayName = $"{auth0User.GivenName} {auth0User.FamilyName}"
            var addLoginResult = await _userManager.AddLoginAsync(
                newAppUser,
                new UserLoginInfo(
                    loginProvider,
                    providerKey,
                    $"{auth0User.GivenName} {auth0User.FamilyName}"
                )
            );
            
            if (!addLoginResult.Succeeded)
            {
                Logger.LogError("Unable to create addLoginResult {User}, {@Errors}", sub, result.Errors);
                await SendUnauthorizedAsync(cT);
                return;
                // return BadRequest(result.Errors);
            }

            await _signInManager.SignInAsync(newAppUser, false);
            // userManager.AddLoginAsync(user.Id, new Microsoft.AspNet.Identity.UserLoginInfo("Facebook", id))
        }

        var idk = new AppUserIdentity { LoginProvider = loginProvider, ProviderKey = providerKey };

        if (authUser is null)
        {
            Logger.LogError("User is null");
            ThrowError("User is null");
        }

        await SendOkAsync(authUser!, cT);
    }
}