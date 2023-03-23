using Identity.API.Deprecated.Entities;
using Identity.API.Deprecated.Exceptions;
using Identity.API.Deprecated.Extensions;
using Identity.API.Deprecated.Helpers;
using Identity.API.Deprecated.Mapping;
using MassTransit;
using Mediator;
using Microsoft.AspNetCore.Identity;

namespace Identity.API.Deprecated.Handlers;

public sealed record AuthorizeCommand(HttpContext HttpContext)
    : ICommand<AppUser>;

public class AuthorizeHandler
    : ICommandHandler<AuthorizeCommand, AppUser>
{
    private readonly ILogger<AuthorizeHandler> _logger;
    private readonly IPublishEndpoint _publishEndpoint;
    private readonly UserManager<AppUser> _userManager;

    public AuthorizeHandler(UserManager<AppUser> userManager,
        ILogger<AuthorizeHandler> logger, IPublishEndpoint publishEndpoint)
    {
        _userManager = userManager;
        _logger = logger;
        _publishEndpoint = publishEndpoint;
    }

    public async ValueTask<AppUser> Handle(
        AuthorizeCommand request,
        CancellationToken cT
    )
    {
        var user = request.HttpContext.User;
        var externalLogin = user.GetLogin();

        var existingAppUser =
            await _userManager.FindByLoginAsync(externalLogin.LoginProvider, externalLogin.ProviderKey);

        if (existingAppUser is not null)
        {
            await request.HttpContext.SignInAppUserAsync(existingAppUser);
            // var appUserLoggedInEvent = existingAppUser.ToEvent().LoggedIn();
            // await _publishEndpoint.Publish(existingAppUser.ToEvent().LoggedIn(), cT);
            return existingAppUser;
        }

        var appUser = user.ToAppUser();

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
        // var appUserLoggedInEvent = appUser.ToEvent().LoggedIn();
        // await _publishEndpoint.Publish(appUser.ToEvent().LoggedIn(), cT);

        return appUser;
    }
}