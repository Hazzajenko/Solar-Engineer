using System.Security.Claims;
using Identity.Contracts.Data;
using Identity.Domain;
using Infrastructure.Authentication;
using JasperFx.Core;
using Mapster;
using Microsoft.AspNetCore.Identity;
using Microsoft.VisualBasic;

namespace Identity.Application.Mapping;

public static class AppUserMapper
{
    public static AppUser ToAppUser(this ClaimsPrincipal user, ExternalLoginInfo externalLoginInfo)
    {
        var name = user.FindFirst(ClaimTypes.Name)?.Value;
        ArgumentNullException.ThrowIfNull(name);

        if (externalLoginInfo.LoginProvider == "google")
        {
            var firstName = user.FindFirst(ClaimTypes.GivenName)?.Value;
            ArgumentNullException.ThrowIfNull(firstName);
            var lastName = user.FindFirst(ClaimTypes.Surname)?.Value;
            ArgumentNullException.ThrowIfNull(lastName);
            var email = user.FindFirst(ClaimTypes.Email)?.Value;
            ArgumentNullException.ThrowIfNull(email);
            var userName = Strings.Split(email, "@")[0];
            var photoUrl = user.FindFirst(CustomClaims.Picture)?.Value;
            ArgumentNullException.ThrowIfNull(photoUrl);
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
            userName = userName.Replace(" ", "");
            userName = userName.ToLowerInvariant();
            var photoUrl = user.FindFirst(CustomClaims.Picture)?.Value;
            ArgumentNullException.ThrowIfNull(photoUrl);
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

        if (externalLoginInfo.LoginProvider == "microsoft")
        {
            var firstName = user.FindFirst(ClaimTypes.GivenName)?.Value;
            ArgumentNullException.ThrowIfNull(firstName);
            var lastName = user.FindFirst(ClaimTypes.Surname)?.Value;
            ArgumentNullException.ThrowIfNull(lastName);
            var email = user.FindFirst(ClaimTypes.Email)?.Value;
            ArgumentNullException.ThrowIfNull(email);
            var userName = Strings.Split(email, "@")[0];

            var photoUrl = "https://robohash.org/user1.png?size=30x30";

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

    /*public static WebUserDto ToWebUserDto(this AppUserDto request)
    {
        return new WebUserDto
        {
            Id = request.Id,
            DisplayName = request.DisplayName,
            UserName = request.UserName,
            PhotoUrl = request.PhotoUrl,
            IsFriend = false,
            IsOnline = false,
            BecameFriendsTime = 
            
        }
    }*/

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

public class AppUserMappingConfig : IRegister
{
    public void Register(TypeAdapterConfig config)
    {
        config
            .NewConfig<AppUser, AppUserDto>()
            .Map(dest => dest.Id, src => src.Id.ToString())
            .Map(dest => dest.DisplayName, src => src.DisplayName)
            .Map(dest => dest.UserName, src => src.UserName)
            .Map(dest => dest.FirstName, src => src.FirstName)
            .Map(dest => dest.LastName, src => src.LastName)
            .Map(dest => dest.PhotoUrl, src => src.PhotoUrl)
            .Map(dest => dest.CreatedTime, src => src.CreatedTime)
            .Map(dest => dest.LastModifiedTime, src => src.LastModifiedTime);

        config
            .NewConfig<AppUser, WebUserDto>()
            .Map(dest => dest.Id, src => src.Id.ToString())
            .Map(dest => dest.DisplayName, src => src.DisplayName)
            .Map(dest => dest.UserName, src => src.UserName)
            .Map(dest => dest.PhotoUrl, src => src.PhotoUrl)
            .Map(dest => dest.IsFriend, src => false)
            .Map(dest => dest.IsOnline, src => false)
            .Map(dest => dest.RegisteredAtTime, src => src.CreatedTime)
            // .Map(dest => dest.BecameFriendsTime, src => DateTime.N)
            .Map(dest => dest.LastActiveTime, src => src.LastModifiedTime);
    }
}
