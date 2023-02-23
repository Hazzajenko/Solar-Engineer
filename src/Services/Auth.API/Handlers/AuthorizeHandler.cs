using Auth.API.Entities;
using Auth.API.Exceptions;
using Auth.API.Extensions;
using Auth.API.Helpers;
using Auth.API.Mapping;
using EventBus.Mapping;
using Mediator;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Identity;

namespace Auth.API.Handlers;

public sealed record AuthorizeCommand(HttpContext HttpContext)
    : ICommand<AuthUser>;

public class AuthorizeHandler
    : ICommandHandler<AuthorizeCommand, AuthUser>
{
    private readonly ILogger<AuthorizeHandler> _logger;
    private readonly IPublishEndpoint _publishEndpoint;
    private readonly UserManager<AuthUser> _userManager;
    private readonly SignInManager<AuthUser> _signInManager;

    public AuthorizeHandler(UserManager<AuthUser> userManager,
        ILogger<AuthorizeHandler> logger, IPublishEndpoint publishEndpoint, SignInManager<AuthUser> signInManager)
    {
        _userManager = userManager;
        _logger = logger;
        _publishEndpoint = publishEndpoint;
        _signInManager = signInManager;
    }

    public async ValueTask<AuthUser> Handle(
        AuthorizeCommand request,
        CancellationToken cT
    )
    {
        var user = request.HttpContext.User;
        var externalLogin = user.GetLogin();

        var existingAppUser =
            await _userManager.FindByLoginAsync(externalLogin.LoginProvider, externalLogin.ProviderKey);

        var info = await _signInManager.GetExternalLoginInfoAsync();
        ArgumentNullException.ThrowIfNull(info);
        ArgumentNullException.ThrowIfNull(info.AuthenticationTokens);

        if (existingAppUser is not null)
        {
            var props = new AuthenticationProperties();
            props.StoreTokens(info.AuthenticationTokens);
            props.IsPersistent = false;
            // await _signInManager.SignInAsync(existingAppUser, props, info.LoginProvider);
            var externalLoginSignInResult = await _signInManager.ExternalLoginSignInAsync(info.LoginProvider, info.ProviderKey, isPersistent: false, bypassTwoFactor: true);
            if (externalLoginSignInResult.Succeeded is false)
            {
                _logger.LogError("Unable to login user {User}, {Provider}", existingAppUser.Id, info.LoginProvider);
                throw new UnauthorizedException();
            }
            
            // await _signInManager.SignInAsync(existingAppUser, props, info.LoginProvider);
            
            /*if (signInResult.Succeeded)
            {
                _logger.LogInformation("{Name} logged in with {LoginProvider} provider.", info.Principal.Identity.Name, info.LoginProvider);
                if (_claimsToSync.Count > 0)
                {
                }*/

                /*var props = new AuthenticationProperties();
                props.StoreTokens(info!.AuthenticationTokens!);*/
            // props.IsPersistent = false;
            // await request.HttpContext.SignInAppUserAsync(existingAppUser);
            // var appUserLoggedInEvent = existingAppUser.ToEvent().LoggedIn();
            // await _publishEndpoint.Publish(existingAppUser.ToEvent().LoggedIn(), cT);
            return existingAppUser;
        }

        var appUser = user.ToAppUser();

        var createUserResult = await _userManager.CreateAsync(appUser);

        if (!createUserResult.Succeeded)
        {
            _logger.LogError("Unable to create user {@User}, {@Errors}", user, createUserResult.Errors);
            throw new UnauthorizedException();
        }

        var addLoginResult = await _userManager.AddLoginAsync(
            appUser,
            new UserLoginInfo(
                externalLogin.LoginProvider,
                externalLogin.ProviderKey,
                appUser.Email
            )
        );

        if (!addLoginResult.Succeeded)
        {
            _logger.LogError(
                "Unable to add login provider to AppUser {User}, {@Errors}",
                appUser.Id,
                createUserResult.Errors
            );
            throw new UnauthorizedException();
        }

        var createdUserLoginResult = await _signInManager.ExternalLoginSignInAsync(info.LoginProvider, info.ProviderKey, isPersistent: false, bypassTwoFactor: true);
        if (createdUserLoginResult.Succeeded is false)
        {
            _logger.LogError("Unable to login user {User}, {Provider}", appUser.Id, info.LoginProvider);
            throw new UnauthorizedException();
        }
        // await request.HttpContext.SignInAppUserAsync(appUser);
        // var appUserLoggedInEvent = appUser.ToEvent().LoggedIn();
        // await _publishEndpoint.Publish(appUser.ToEvent().LoggedIn(), cT);

        return appUser;
    }
}