using System.Security.Claims;
using Identity.Contracts.Data;
using Identity.Domain.Auth;
using Infrastructure.Authentication;

namespace Identity.Application.Mapping;

public static class AppUserMapper
{
    public static AppUser ToAppUser(this ClaimsPrincipal user)
    {
        var firstName = user.FindFirst(ClaimTypes.GivenName)?.Value;
        if (firstName is null)
            throw new ArgumentNullException(nameof(firstName));
        var lastName = user.FindFirst(ClaimTypes.Surname)?.Value;
        if (lastName is null)
            throw new ArgumentNullException(nameof(lastName));
        var email = user.FindFirst(ClaimTypes.Email)?.Value;
        if (email is null)
            throw new ArgumentNullException(nameof(email));
        var photoUrl = user.FindFirst(CustomClaims.Picture)?.Value;
        if (photoUrl is null)
            throw new ArgumentNullException(nameof(photoUrl));

        return new AppUser
        {
            FirstName = firstName,
            LastName = lastName,
            Email = email,
            DisplayName = $"{firstName} {lastName}",
            PhotoUrl = photoUrl
        };
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
            PhotoUrl = request.PhotoUrl
        };
    }
}