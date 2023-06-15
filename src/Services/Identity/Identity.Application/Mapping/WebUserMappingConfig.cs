using Identity.Contracts.Data;
using Identity.Domain;
using Infrastructure.SignalR;
using Mapster;
using Microsoft.AspNetCore.SignalR;

namespace Identity.Application.Mapping;

public class WebUserMappingConfig : IRegister
{
    public void Register(TypeAdapterConfig config)
    {
        config
            .NewConfig<AppUser, WebUserDto>()
            .Map(dest => dest.Id, src => src.Id.ToString())
            .Map(dest => dest.DisplayName, src => src.DisplayName)
            .Map(dest => dest.PhotoUrl, src => src.PhotoUrl)
            .Map(dest => dest.UserName, src => src.UserName)
            .Map(dest => dest.IsFriend, src => false)
            .Map(dest => dest.BecameFriendsTime, src => (DateTime?)null)
            .Map(dest => dest.RegisteredAtTime, src => src.CreatedTime)
            .Map(dest => dest.LastActiveTime, src => src.LastActiveTime);
    }
}

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
}
