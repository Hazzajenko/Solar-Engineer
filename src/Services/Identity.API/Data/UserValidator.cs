using System.Security.Claims;
using Duende.IdentityServer.Models;
using Duende.IdentityServer.Validation;
using Identity.API.Entities;
using Microsoft.AspNetCore.Identity;

namespace Identity.API.Data;

public class UserValidator : IResourceOwnerPasswordValidator
{
    private readonly SignInManager<AppUser> _signInManager;
    private readonly UserManager<AppUser> _userManager;

    public UserValidator(SignInManager<AppUser> signInManager,
        UserManager<AppUser> userManager)
    {
        _signInManager = signInManager;
        _userManager = userManager;
    }

    public async Task ValidateAsync(ResourceOwnerPasswordValidationContext context)
    {
        var user = await _userManager.FindByNameAsync(context.UserName);
        if (user is not null)
        {
            var signIn = await _signInManager.PasswordSignInAsync(
                user!,
                context.Password,
                true,
                true);

            if (signIn.Succeeded)
            {
                var userId = user!.Id.ToString();
                context.Result = new GrantValidationResult(
                    userId,
                    "custom",
                    new[]
                    {
                        new(ClaimTypes.NameIdentifier, userId),
                        new Claim(ClaimTypes.Name, user.UserName!)
                    }
                );

                return;
            }
        }

        context.Result = new GrantValidationResult(TokenRequestErrors.UnauthorizedClient, "Invalid Credentials");
    }
}