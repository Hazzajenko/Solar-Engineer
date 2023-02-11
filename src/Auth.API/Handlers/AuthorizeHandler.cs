using System.Security.Claims;
using Auth.API.Commands;
using Auth.API.Domain;
using Auth.API.Exceptions;
using Auth.API.Extensions;
using Auth.API.Services;
using Mediator;
using Microsoft.AspNetCore.Identity;

namespace Auth.API.Handlers;

public class AuthorizeHandler
    : IRequestHandler<AuthorizeCommand, AppUser>
{
    private readonly IAuthService _authService;
    private readonly ILogger<AuthorizeHandler> _logger;
    private readonly UserManager<AppUser> _userManager;

    public AuthorizeHandler(UserManager<AppUser> userManager, IAuthService authService,
        ILogger<AuthorizeHandler> logger)
    {
        _userManager = userManager;
        _authService = authService;
        _logger = logger;
    }

    public async ValueTask<AppUser> Handle(
        AuthorizeCommand request,
        CancellationToken cT
    )
    {
        var user = request.HttpContext.User;
        var loginProvider = user.Identity?.AuthenticationType;
        if (loginProvider is null) throw new ArgumentNullException(nameof(loginProvider));
        var providerKey = user.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (providerKey is null) throw new ArgumentNullException(nameof(providerKey));


        var appUser = await _userManager.FindByLoginAsync(loginProvider, providerKey);

        if (appUser is not null)
        {
            /*var claims = new List<Claim>
            {
                new(ClaimTypes.NameIdentifier, appUser.Id.ToString()),
                new(ClaimTypesExtensions.LoginProvider, loginProvider),
                new(ClaimTypesExtensions.ProviderKey, providerKey)
            };

            var claimsIdentity = new ClaimsIdentity(
                claims, CookieAuthenticationDefaults.AuthenticationScheme);*/

            var appUserClaims = await _userManager.GetClaimsAsync(appUser);
            var appUserClaimValues = appUserClaims.Select(x => x.Value);
            var newClaims = user.Claims.Where(x => appUserClaimValues.Contains(x.Value) is false).ToList();
            var claimsResult = await _userManager.AddClaimsAsync(appUser, newClaims);
            return appUser;
            // if (claimsResult.Succeeded is false) throw new UnauthorizedException();
            // appUserClaims.Select(x => x.Value)
            /*foreach (var userClaim in user.Claims)
                if (appUserClaims.Contains(userClaim) is false)
                {
                    var claimResult = await _userManager.AddClaimAsync(appUser, userClaim);
                    if (claimResult.Succeeded is false) throw new UnauthorizedException();
                }*/

            /*await request.HttpContext.SignInAsync(
                "cookie",
                new ClaimsPrincipal(claimsIdentity), new AuthenticationProperties
                {
                    IsPersistent = true
                }
            );*/
            /*await SendRedirectAsync("http://localhost:4200/", cancellation: cT);
            return;*/
        }

        var firstName = user.FindFirst(ClaimTypes.GivenName)?.Value;
        if (firstName is null) throw new ArgumentNullException(nameof(firstName));
        var lastName = user.FindFirst(ClaimTypes.Surname)?.Value;
        if (lastName is null) throw new ArgumentNullException(nameof(lastName));
        var photoUrl = user.FindFirst(ClaimTypesExtensions.Picture)?.Value;
        if (photoUrl is null) throw new ArgumentNullException(nameof(photoUrl));

        AppUser newAppUser = new()
        {
            UserName = providerKey,
            FirstName = firstName,
            LastName = lastName,
            PhotoUrl = photoUrl
        };
        var result = await _userManager.CreateAsync(newAppUser);

        if (!result.Succeeded)
        {
            _logger.LogError("Unable to create user {@User}, {@Errors}", user, result.Errors);
            throw new UnauthorizedException();
        }

        var identityResult = await _userManager.AddLoginAsync(
            newAppUser,
            new UserLoginInfo(
                loginProvider,
                providerKey,
                $"{firstName} {lastName}"
            )
        );

        if (!identityResult.Succeeded)
        {
            _logger.LogError(
                "Unable to add login provider to AppUser {User}, {@Errors}",
                newAppUser.Id,
                result.Errors
            );
            throw new UnauthorizedException();
        }

        return newAppUser;

        /*var newAppUserClaims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, newAppUser.Id.ToString()),
            new(ClaimTypesExtensions.LoginProvider, loginProvider),
            new(ClaimTypesExtensions.ProviderKey, providerKey)
        };


        var newAppUserIdentity = new ClaimsIdentity(
            newAppUserClaims, CookieAuthenticationDefaults.AuthenticationScheme);*/

        /*await request.HttpContext.SignInAsync(
            "cookie",
            new ClaimsPrincipal(newAppUserIdentity), new AuthenticationProperties
            {
                IsPersistent = true
            }
        );*/
    }
}