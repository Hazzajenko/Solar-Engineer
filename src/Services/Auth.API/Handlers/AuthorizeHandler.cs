using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Auth.API.Commands;
using Auth.API.Exceptions;
using Auth.API.Extensions;
using Auth.API.Helpers;
using Auth.API.Mapping;
using Infrastructure.Authentication;
using Infrastructure.Entities.Identity;
using Mediator;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Identity;

namespace Auth.API.Handlers;

public class AuthorizeHandler
    : IRequestHandler<AuthorizeCommand, AppUser>
{
    private readonly ILogger<AuthorizeHandler> _logger;
    private readonly UserManager<AppUser> _userManager;

    public AuthorizeHandler(UserManager<AppUser> userManager,
        ILogger<AuthorizeHandler> logger)
    {
        _userManager = userManager;
        _logger = logger;
    }

    public async ValueTask<AppUser> Handle(
        AuthorizeCommand request,
        CancellationToken cT
    )
    {
        var user = request.HttpContext.User;
        var externalLogin = user.GetLogin();

        var existingAppUser = await _userManager.FindByLoginAsync(externalLogin.LoginProvider, externalLogin.ProviderKey);

        if (existingAppUser is not null)
        {
            await request.HttpContext.SignInAppUserAsync(existingAppUser);
            return existingAppUser;
        }

        AppUser appUser = user.ToAppUser();
        
        var result = await _userManager.CreateAsync(appUser);

        if (!result.Succeeded)
        {
            _logger.LogError("Unable to create user {@User}, {@Errors}", user, result.Errors);
            throw new UnauthorizedException();
        }

        var identityResult = await _userManager.AddLoginAsync(
            appUser,
            new UserLoginInfo(
                externalLogin.LoginProvider,
                externalLogin.ProviderKey,
                appUser.Email
            )
        );

        if (!identityResult.Succeeded)
        {
            _logger.LogError(
                "Unable to add login provider to AppUser {User}, {@Errors}",
                appUser.Id,
                result.Errors
            );
            throw new UnauthorizedException();
        }

        await request.HttpContext.SignInAppUserAsync(appUser);

        return appUser;


    }
}