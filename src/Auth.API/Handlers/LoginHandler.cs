using Auth.API.Commands;
using Auth.API.Contracts.Data;
using Auth.API.Domain;
using Auth.API.Exceptions;
using Auth.API.Extensions;
using Auth.API.Services;

using Mediator;

using Microsoft.AspNetCore.Identity;

namespace Auth.API.Handlers;

public class LoginHandler
    : IRequestHandler<LoginCommand, AppUser>
{
    private readonly IAuthService _authService;
    private readonly ILogger<LoginHandler> _logger;
    private readonly UserManager<AppUser> _userManager;

    public LoginHandler(UserManager<AppUser> userManager, IAuthService authService, ILogger<LoginHandler> logger)
    {
        _userManager = userManager;
        _authService = authService;
        _logger = logger;
    }

    public async ValueTask<AppUser> Handle(
        LoginCommand request,
        CancellationToken cT
    )
    {
        ProviderLogin providerLogin = request.User.GetProviderLogin();

        AppUser? appUser = await _userManager.FindByLoginAsync(
            providerLogin.LoginProvider,
            providerLogin.ProviderKey
        );

        if (appUser is not null)
        {
            return appUser;
        }

        string identity = request.User.GetIdentity();
        Auth0UserDto? auth0User = await _authService.GetAuthUser(identity);
        if (auth0User is null)
        {
            _logger.LogError("Auth0 User {Subject} does not exist", identity);
            string message = "Auth0 User does not exist";
            throw new NotFoundException(message);
        }

        AppUser newAppUser = new ()
        {
            UserName = auth0User.UserId,
            FirstName = auth0User.GivenName,
            LastName = auth0User.FamilyName,
            PhotoUrl = auth0User.Picture
        };
        IdentityResult result = await _userManager.CreateAsync(newAppUser);

        if (!result.Succeeded)
        {
            _logger.LogError("Unable to create user {User}, {@Errors}", identity, result.Errors);
            throw new UnauthorizedException();
        }

        IdentityResult identityResult = await _userManager.AddLoginAsync(
            newAppUser,
            new UserLoginInfo(
                providerLogin.LoginProvider,
                providerLogin.ProviderKey,
                $"{auth0User.GivenName} {auth0User.FamilyName}"
            )
        );

        if (!identityResult.Succeeded)
        {
            _logger.LogError(
                "Unable to add login provider to AppUser {User}, {@Errors}",
                identity,
                result.Errors
            );
            throw new UnauthorizedException();
        }

        return newAppUser;
    }
}