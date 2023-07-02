using System.Security.Claims;
using Identity.Application.Commands;
using Identity.Application.Exceptions;
using Identity.Application.Extensions;
using Identity.Application.Mapping;
using Identity.Domain;
using Mediator;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;

namespace Identity.Application.Handlers.Auth;

public class AuthorizeHandler : IRequestHandler<AuthorizeCommand, ExternalSigninResponse>
{
    private readonly ILogger<AuthorizeHandler> _logger;
    private readonly IMediator _mediator;
    private readonly SignInManager<AppUser> _signInManager;
    private readonly UserManager<AppUser> _userManager;

    public AuthorizeHandler(
        UserManager<AppUser> userManager,
        ILogger<AuthorizeHandler> logger,
        SignInManager<AppUser> signInManager,
        IMediator mediator
    )
    {
        _userManager = userManager;
        _logger = logger;
        _signInManager = signInManager;
        _mediator = mediator;
    }

    public async ValueTask<ExternalSigninResponse> Handle(
        AuthorizeCommand request,
        CancellationToken cT
    )
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
            return await HandleExistingUserSignIn(existingAppUser, info);

        return await HandleNewUserSignIn(user, info);
    }

    private async Task<ExternalSigninResponse> HandleExistingUserSignIn(
        AppUser existingAppUser,
        ExternalLoginInfo externalLogin
    )
    {
        var props = new AuthenticationProperties();
        props.StoreTokens(externalLogin.AuthenticationTokens!);
        props.IsPersistent = false;
        try
        {
            var externalLoginSignInResult = await _signInManager.ExternalLoginSignInAsync(
                externalLogin.LoginProvider,
                externalLogin.ProviderKey,
                false,
                true
            );
            if (externalLoginSignInResult.Succeeded is false)
            {
                _logger.LogError(
                    "Unable to login user {User}, {Provider}",
                    existingAppUser.Id,
                    externalLogin.LoginProvider
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
        return new() { AppUser = existingAppUser, LoginProvider = externalLogin.LoginProvider };
    }

    private async Task<ExternalSigninResponse> HandleNewUserSignIn(
        ClaimsPrincipal user,
        ExternalLoginInfo externalLogin
    )
    {
        var appUser = user.ToAppUser(externalLogin);

        IdentityResult createUserResult = await _userManager.CreateAsync(appUser);

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
            externalLogin.LoginProvider,
            externalLogin.ProviderKey,
            false,
            true
        );
        if (!createdUserLoginResult.Succeeded)
        {
            _logger.LogError(
                "Unable to login user {User}, {Provider}",
                appUser.Id,
                externalLogin.LoginProvider
            );
            throw new UnauthorizedException();
        }

        UploadUrlImageToCdnResponse uploadPhotoResponse = await _mediator.Send(
            new UploadUrlImageToCdnCommand(appUser)
        );

        appUser.PhotoUrl = uploadPhotoResponse.PhotoUrl;
        await _userManager.UpdateAsync(appUser);
        return new() { AppUser = appUser, LoginProvider = externalLogin.LoginProvider };
    }
}
