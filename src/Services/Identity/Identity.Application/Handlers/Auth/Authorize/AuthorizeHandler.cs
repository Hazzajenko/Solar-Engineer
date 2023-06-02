using Identity.Application.Exceptions;
using Identity.Application.Extensions;
using Identity.Application.Mapping;
using Identity.Domain.Auth;
using Mediator;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;

namespace Identity.Application.Handlers.Auth.Authorize;

public class AuthorizeHandler : IRequestHandler<AuthorizeCommand, AppUser>
{
    private readonly ILogger<AuthorizeHandler> _logger;
    private readonly SignInManager<AppUser> _signInManager;
    private readonly UserManager<AppUser> _userManager;

    public AuthorizeHandler(
        UserManager<AppUser> userManager,
        ILogger<AuthorizeHandler> logger,
        SignInManager<AppUser> signInManager
    )
    {
        _userManager = userManager;
        _logger = logger;
        _signInManager = signInManager;
    }

    public async ValueTask<AppUser> Handle(AuthorizeCommand request, CancellationToken cT)
    {
        var user = request.HttpContext.User;
        var externalLogin = user.GetLogin();

        var existingAppUser = await _userManager.FindByLoginAsync(
            externalLogin.LoginProvider,
            externalLogin.ProviderKey
        );

        var info = await _signInManager.GetExternalLoginInfoAsync();
        ArgumentNullException.ThrowIfNull(info);
        ArgumentNullException.ThrowIfNull(info.AuthenticationTokens);

        if (existingAppUser is not null)
        {
            var props = new AuthenticationProperties();
            props.StoreTokens(info.AuthenticationTokens);
            props.IsPersistent = false;
            // await _signInManager.SignInAsync(existingAppUser, props, info.LoginProvider);
            /*var externalLoginSignInResult = await _signInManager.ExternalLoginSignInAsync(
                info.LoginProvider,
                info.ProviderKey,
                false,
                true
            );*/
            try
            {
                var externalLoginSignInResult = await _signInManager.ExternalLoginSignInAsync(
                    info.LoginProvider,
                    info.ProviderKey,
                    false,
                    true
                );
                if (externalLoginSignInResult.Succeeded is false)
                {
                    _logger.LogError(
                        "Unable to login user {User}, {Provider}",
                        existingAppUser.Id,
                        info.LoginProvider
                    );
                    throw new UnauthorizedException();
                    // throw new UnauthorizedException();
                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw new UnauthorizedException();
            }
            /*if (externalLoginSignInResult.Succeeded is false)
            {
                _logger.LogError(
                    "Unable to login user {User}, {Provider}",
                    existingAppUser.Id,
                    info.LoginProvider
                );
                throw new UnauthorizedException();
                // throw new UnauthorizedException();
            }*/

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

        _logger.LogError("Unable to find user {@User}", appUser);

        var createUserResult = await _userManager.CreateAsync(appUser);

        if (!createUserResult.Succeeded)
        {
            _logger.LogError(
                "Unable to create user {@User}, {@Errors}",
                user,
                createUserResult.Errors
            );
            throw new UnauthorizedException();
        }

        var addLoginResult = await _userManager.AddLoginAsync(
            appUser,
            new UserLoginInfo(externalLogin.LoginProvider, externalLogin.ProviderKey, appUser.Email)
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

        var createdUserLoginResult = await _signInManager.ExternalLoginSignInAsync(
            info.LoginProvider,
            info.ProviderKey,
            false,
            true
        );
        if (createdUserLoginResult.Succeeded is false)
        {
            _logger.LogError(
                "Unable to login user {User}, {Provider}",
                appUser.Id,
                info.LoginProvider
            );
            throw new UnauthorizedException();
        }
        // await request.HttpContext.SignInAppUserAsync(appUser);
        // var appUserLoggedInEvent = appUser.ToEvent().LoggedIn();
        // await _publishEndpoint.Publish(appUser.ToEvent().LoggedIn(), cT);

        return appUser;
    }
}