using System.Security.Claims;
using Auth.API.Domain;
using Auth.API.Exceptions;
using Auth.API.Extensions;
using Mediator;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Identity;

namespace Auth.API.Endpoints;

// [Authorize]
public class SuccessfulLoginEndpoint : EndpointWithoutRequest
{
    private readonly IMediator _mediator;
    private readonly SignInManager<AppUser> _signInManager;
    private readonly UserManager<AppUser> _userManager;

    public SuccessfulLoginEndpoint(
        IMediator mediator, UserManager<AppUser> userManager, SignInManager<AppUser> signInManager)
    {
        _mediator = mediator;
        _userManager = userManager;
        _signInManager = signInManager;
    }


    public override void Configure()
    {
        Get("/successful-login");
        AuthSchemes("cookie");
        // AllowAnonymous();
        // Options(b => b.RequireCors(x => x.AllowAnyOrigin()));
        // PermissionsAll("read:current_user");
    }

    public override async Task HandleAsync(CancellationToken cT)
    {
        var ctx = HttpContext;
        var user = User;
        var loginProvider = User.Identity?.AuthenticationType;
        if (loginProvider is null) throw new ArgumentNullException(nameof(loginProvider));
        var providerKey = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (providerKey is null) throw new ArgumentNullException(nameof(providerKey));


        var appUser = await _userManager.FindByLoginAsync(loginProvider, providerKey);

        if (appUser is not null)
        {
            var claims = new List<Claim>
            {
                new(ClaimTypes.NameIdentifier, appUser.Id.ToString()),
                new(ClaimTypesExtensions.LoginProvider, loginProvider),
                new(ClaimTypesExtensions.ProviderKey, providerKey)
            };

            var claimsIdentity = new ClaimsIdentity(
                claims, CookieAuthenticationDefaults.AuthenticationScheme);

            var appUserClaims = await _userManager.GetClaimsAsync(appUser);
            foreach (var userClaim in User.Claims)
                if (appUserClaims.Contains(userClaim) is false)
                {
                    var claimResult = await _userManager.AddClaimAsync(appUser, userClaim);
                    if (claimResult.Succeeded is false) throw new UnauthorizedException();
                }

            await HttpContext.SignInAsync(
                "cookie",
                new ClaimsPrincipal(claimsIdentity), new AuthenticationProperties
                {
                    IsPersistent = true
                }
            );
            await SendRedirectAsync("http://localhost:4200/", cancellation: cT);
            return;
        }

        var firstName = User.FindFirst(ClaimTypes.GivenName);
        if (firstName is null) throw new ArgumentNullException(nameof(firstName));
        var lastName = User.FindFirst(ClaimTypes.Surname);
        if (lastName is null) throw new ArgumentNullException(nameof(lastName));
        var photoUrl = User.FindFirst(ClaimTypesExtensions.Picture);
        if (photoUrl is null) throw new ArgumentNullException(nameof(photoUrl));

        AppUser newAppUser = new()
        {
            UserName = providerKey,
            FirstName = firstName.Value,
            LastName = lastName.Value,
            PhotoUrl = photoUrl.Value
        };
        var result = await _userManager.CreateAsync(newAppUser);

        if (!result.Succeeded)
        {
            Logger.LogError("Unable to create user {@User}, {@Errors}", User, result.Errors);
            throw new UnauthorizedException();
        }

        var identityResult = await _userManager.AddLoginAsync(
            newAppUser,
            new UserLoginInfo(
                loginProvider,
                providerKey,
                $"{firstName.Value} {lastName.Value}"
            )
        );

        if (!identityResult.Succeeded)
        {
            Logger.LogError(
                "Unable to add login provider to AppUser {User}, {@Errors}",
                newAppUser.Id,
                result.Errors
            );
            throw new UnauthorizedException();
        }

        var claims2 = new List<Claim>
        {
            new(ClaimTypes.Name, newAppUser.DisplayName)
        };

        var claimsIdentity2 = new ClaimsIdentity(
            claims2, CookieAuthenticationDefaults.AuthenticationScheme);

        await HttpContext.SignInAsync(
            "cookie",
            new ClaimsPrincipal(claimsIdentity2), new AuthenticationProperties
            {
                IsPersistent = true
            }
        );

        await SendRedirectAsync("http://localhost:4200/", cancellation: cT);

        // await SendOkAsync(claims, cT);
    }
}