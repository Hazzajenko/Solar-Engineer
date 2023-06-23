using Identity.Contracts.Data;
using Identity.Domain;
using Infrastructure.SignalR;
using Mapster;
using Microsoft.AspNetCore.SignalR;

namespace Identity.Application.Mapping;

public static class WebUserMapping
{
    public static WebUserDto ToWebUserDto(this AppUserLink appUserLink, Guid currentAppUserId)
    {
        var webUser =
            currentAppUserId == appUserLink.AppUserRequestedId
                ? appUserLink.AppUserReceived
                : appUserLink.AppUserRequested;
        var becameFriendsTime = (DateTime)appUserLink.BecameFriendsTime!;
        becameFriendsTime.ThrowHubExceptionIfNull();
        return new WebUserDto
        {
            Id = webUser.Id.ToString(),
            DisplayName = webUser.DisplayName,
            PhotoUrl = webUser.PhotoUrl,
            UserName = webUser.UserName,
            BecameFriendsTime = becameFriendsTime,
            IsFriend = appUserLink.Friends,
            LastActiveTime = webUser.LastActiveTime,
            RegisteredAtTime = webUser.CreatedTime,
            IsOnline = false
        };
    }

    public static IEnumerable<WebUserDto> ToWebUserDtoList(
        this AppUserLink appUserLink,
        Guid currentAppUserId
    )
    {
        return new List<WebUserDto> { appUserLink.ToWebUserDto(currentAppUserId) };
    }

    public static WebUserDto ToWebUserDto(this AppUser appUser)
    {
        return new WebUserDto
        {
            Id = appUser.Id.ToString(),
            DisplayName = appUser.DisplayName,
            PhotoUrl = appUser.PhotoUrl,
            UserName = appUser.UserName,
            IsFriend = false,
            IsOnline = false,
            BecameFriendsTime = null,
            LastActiveTime = appUser.LastActiveTime,
            RegisteredAtTime = appUser.CreatedTime
        };
    }
}
