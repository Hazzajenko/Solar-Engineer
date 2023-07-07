using System.Security.Claims;
using ApplicationCore.Events.AppUsers;
using ApplicationCore.Exceptions;
using Identity.Application.Commands;
using Identity.Application.Extensions;
using Identity.Application.Mapping;
using Identity.Application.Models;
using Identity.Application.Services.AzureStorage;
using Identity.Contracts.Data;
using Identity.Domain;
using Infrastructure.Logging;
using Infrastructure.Mapping;
using MassTransit;
using Mediator;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;

namespace Identity.Application.Handlers.Auth;

public class AuthorizeHandler : IRequestHandler<AuthorizeCommand, ExternalSigninResponse>
{
    private readonly ILogger<AuthorizeHandler> _logger;
    private readonly SignInManager<AppUser> _signInManager;
    private readonly UserManager<AppUser> _userManager;
    private readonly IBus _bus;
    private readonly IAzureStorage _azureStorage;

    public AuthorizeHandler(
        UserManager<AppUser> userManager,
        ILogger<AuthorizeHandler> logger,
        SignInManager<AppUser> signInManager,
        IBus bus,
        IAzureStorage azureStorage
    )
    {
        _userManager = userManager;
        _logger = logger;
        _signInManager = signInManager;
        _bus = bus;
        _azureStorage = azureStorage;
    }

    public async ValueTask<ExternalSigninResponse> Handle(
        AuthorizeCommand request,
        CancellationToken cT
    )
    {
        ClaimsPrincipal user = request.HttpContext.User;
        ExternalLogin externalLogin = user.GetLogin();

        AppUser? existingAppUser = await _userManager.FindByLoginAsync(
            externalLogin.LoginProvider,
            externalLogin.ProviderKey
        );

        ExternalLoginInfo? info = await _signInManager.GetExternalLoginInfoAsync();
        ArgumentNullException.ThrowIfNull(info);
        ArgumentNullException.ThrowIfNull(info.AuthenticationTokens);

        if (existingAppUser is not null)
            return await HandleExistingUserSignIn(existingAppUser, info, cT);

        return await HandleNewUserSignIn(user, info, cT);
    }

    private async Task<ExternalSigninResponse> HandleExistingUserSignIn(
        AppUser existingAppUser,
        ExternalLoginInfo externalLogin,
        CancellationToken cT
    )
    {
        var props = new AuthenticationProperties();
        props.StoreTokens(externalLogin.AuthenticationTokens!);
        props.IsPersistent = false;
        SignInResult externalLoginSignInResult = await _signInManager.ExternalLoginSignInAsync(
            externalLogin.LoginProvider,
            externalLogin.ProviderKey,
            false,
            true
        );
        if (externalLoginSignInResult.Succeeded is false)
        {
            _logger.LogError(
                "User {UserName}: Unable to login User {@User}, {Provider}",
                existingAppUser.UserName,
                existingAppUser.ToDto(),
                externalLogin.LoginProvider
            );
            throw new UnauthorizedException();
        }

        _logger.LogInformation(
            "User {UserName}: Logged in with {Provider}",
            existingAppUser.UserName,
            externalLogin.LoginProvider
        );

        await _bus.Publish(
            new UserLoggedIn(
                existingAppUser.Id,
                existingAppUser.UserName,
                existingAppUser.DisplayName,
                existingAppUser.PhotoUrl
            ),
            cT
        );

        return new() { AppUser = existingAppUser, LoginProvider = externalLogin.LoginProvider };
    }

    private async Task<ExternalSigninResponse> HandleNewUserSignIn(
        ClaimsPrincipal user,
        ExternalLoginInfo externalLogin,
        CancellationToken cT
    )
    {
        var appUser = user.ToAppUser(externalLogin);

        IdentityResult createUserResult = await _userManager.CreateAsync(appUser);

        if (!createUserResult.Succeeded)
        {
            _logger.LogError(
                "User {UserName}: Unable to create User {@User}, {@Errors}",
                appUser.UserName,
                appUser.ToDto(),
                createUserResult.Errors
            );
            throw new UnauthorizedException();
        }

        IdentityResult addLoginResult = await _userManager.AddLoginAsync(
            appUser,
            new UserLoginInfo(externalLogin.LoginProvider, externalLogin.ProviderKey, appUser.Email)
        );

        if (!addLoginResult.Succeeded)
        {
            _logger.LogError(
                "User {UserName}: Unable to add login provider to User {@User}, {@Errors}",
                appUser.UserName,
                appUser.ToDto(),
                createUserResult.Errors
            );
            throw new UnauthorizedException();
        }

        SignInResult createdUserLoginResult = await _signInManager.ExternalLoginSignInAsync(
            externalLogin.LoginProvider,
            externalLogin.ProviderKey,
            false,
            true
        );
        if (!createdUserLoginResult.Succeeded)
        {
            _logger.LogError(
                "User {UserName}: Unable to login User {@User}, {Provider}, {@Errors}",
                appUser.UserName,
                appUser.ToDto(),
                externalLogin.LoginProvider,
                createUserResult.Errors
            );
            throw new UnauthorizedException();
        }

        var photoUrl = await UpdateUrlImageToCdn(appUser, cT);

        appUser.PhotoUrl = photoUrl;
        await _userManager.UpdateAsync(appUser);

        _logger.LogInformation(
            "User {UserName}: Registered {@User} logged in with {Provider}",
            appUser.UserName,
            appUser.ToDto(),
            externalLogin.LoginProvider
        );

        await _bus.Publish(
            new UserRegistered(appUser.Id, appUser.UserName, appUser.DisplayName, appUser.PhotoUrl),
            cT
        );

        return new() { AppUser = appUser, LoginProvider = externalLogin.LoginProvider };
    }

    private async Task<string> UpdateUrlImageToCdn(AppUser appUser, CancellationToken cT = default)
    {
        using var httpClient = new HttpClient();
        var imageBytes = await httpClient.GetByteArrayAsync(appUser.PhotoUrl, cT);
        BlobResponseDto result = await _azureStorage.UploadImageToBlobStorage(
            imageBytes,
            appUser.Id.ToString()
        );

        if (result is null)
        {
            _logger.LogError(
                "User {UserName}: User {@User} failed to upload image to blob storage",
                appUser.UserName,
                appUser.ToDto()
            );
            throw new Exception("Error uploading image to blob storage");
        }

        var photoUrl = result.Blob.Uri;
        if (photoUrl is null)
        {
            _logger.LogError(
                "User {UserName}: User {@User} failed to upload image to blob storage",
                appUser.UserName,
                appUser.ToDto()
            );
            throw new Exception("Error uploading image to blob storage");
        }
        _logger.LogInformation(
            "User {UserName}: Uploaded image dp to blob storage: {Uri}",
            appUser.UserName,
            photoUrl
        );

        return photoUrl;
    }
}
