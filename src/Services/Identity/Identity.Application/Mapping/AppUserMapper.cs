using System.Security.Claims;
using Identity.Contracts.Data;
using Identity.Domain;
using Infrastructure.Authentication;
using Microsoft.AspNetCore.Identity;
using Microsoft.VisualBasic;

namespace Identity.Application.Mapping;

public static class AppUserMapper
{
    public static AppUser ToAppUser(this ClaimsPrincipal user, ExternalLoginInfo externalLoginInfo)
    {
        var name = user.FindFirst(ClaimTypes.Name)?.Value;
        ArgumentNullException.ThrowIfNull(name);
        var photoUrl = user.FindFirst(CustomClaims.Picture)?.Value;
        ArgumentNullException.ThrowIfNull(photoUrl);

        if (externalLoginInfo.LoginProvider == "google")
        {
            var firstName = user.FindFirst(ClaimTypes.GivenName)?.Value;
            ArgumentNullException.ThrowIfNull(firstName);
            var lastName = user.FindFirst(ClaimTypes.Surname)?.Value;
            ArgumentNullException.ThrowIfNull(lastName);
            var email = user.FindFirst(ClaimTypes.Email)?.Value;
            ArgumentNullException.ThrowIfNull(email);
            var userName = Strings.Split(email, "@")[0];
            return new AppUser
            {
                FirstName = firstName,
                LastName = lastName,
                Email = email,
                UserName = userName,
                DisplayName = $"{firstName} {lastName}",
                PhotoUrl = photoUrl
            };
        }

        if (externalLoginInfo.LoginProvider == "github")
        {
            var firstName = name.Split(" ")[0];
            var lastName = name.Split(" ")[1];
            // * Github does not provide email
            var email = user.FindFirst(ClaimTypes.Email)?.Value;
            var userName = user.FindFirst("username")?.Value;
            ArgumentNullException.ThrowIfNull(userName);
            return new AppUser
            {
                FirstName = firstName,
                LastName = lastName,
                Email = email,
                UserName = userName,
                DisplayName = $"{firstName} {lastName}",
                PhotoUrl = photoUrl
            };
        }

        throw new ArgumentException("Invalid login provider");
    }

    public static CurrentUserDto ToCurrentUserDto(this AppUser request)
    {
        return new CurrentUserDto
        {
            Id = request.Id.ToString(),
            DisplayName = request.DisplayName,
            UserName = request.UserName!,
            FirstName = request.FirstName,
            LastName = request.LastName,
            PhotoUrl = request.PhotoUrl,
            Email = request.Email!
        };
    }
}
