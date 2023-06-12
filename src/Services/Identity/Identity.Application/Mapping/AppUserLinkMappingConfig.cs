using Identity.Contracts.Data;
using Identity.Domain;
using Infrastructure.SignalR;
using Mapster;
using Microsoft.AspNetCore.SignalR;

namespace Identity.Application.Mapping;

public static class AppUserLinkMapping
{
    public static FriendDto ToFriendDto(this AppUserLink appUserLink, Guid currentAppUserId)
    {
        var friend =
            currentAppUserId == appUserLink.AppUserRequestedId
                ? appUserLink.AppUserReceived
                : appUserLink.AppUserRequested;
        var becameFriendsTime = (DateTime)appUserLink.BecameFriendsTime!;
        becameFriendsTime.ThrowHubExceptionIfNull();
        return new FriendDto
        {
            Id = friend.Id.ToString(),
            DisplayName = friend.DisplayName,
            PhotoUrl = friend.PhotoUrl,
            UserName = friend.UserName,
            BecameFriendsTime = becameFriendsTime
        };
    }

    public static IEnumerable<FriendDto> ToFriendDtoList(
        this AppUserLink appUserLink,
        Guid currentAppUserId
    )
    {
        return new List<FriendDto> { appUserLink.ToFriendDto(currentAppUserId) };
    }
}

public class AppUserLinkMappingConfig : IRegister
{
    public void Register(TypeAdapterConfig config)
    {
        config
            .NewConfig<(AppUserLink appUserLink, Guid appUserId), FriendDto>()
            .Map(
                dest => dest.Id,
                src =>
                    src.appUserId == src.appUserLink.AppUserRequestedId
                        ? src.appUserLink.AppUserReceivedId.ToString()
                        : src.appUserLink.AppUserRequestedId.ToString()
            )
            .Map(
                dest => dest.DisplayName,
                src =>
                    src.appUserId == src.appUserLink.AppUserRequestedId
                        ? src.appUserLink.AppUserReceived.DisplayName
                        : src.appUserLink.AppUserRequested.DisplayName
            )
            .Map(
                dest => dest.PhotoUrl,
                src =>
                    src.appUserId == src.appUserLink.AppUserRequestedId
                        ? src.appUserLink.AppUserReceived.PhotoUrl
                        : src.appUserLink.AppUserRequested.PhotoUrl
            )
            .Map(
                dest => dest.UserName,
                src =>
                    src.appUserId == src.appUserLink.AppUserRequestedId
                        ? src.appUserLink.AppUserReceived.UserName
                        : src.appUserLink.AppUserRequested.UserName
            )
            .Map(dest => dest.BecameFriendsTime, src => src.appUserLink.BecameFriendsTime);

        config
            .NewConfig<(AppUserLink appUserLink, AppUser appUser), FriendDto>()
            .Map(
                dest => dest.Id,
                src =>
                    src.appUser.Id == src.appUserLink.AppUserRequestedId
                        ? src.appUserLink.AppUserReceivedId.ToString()
                        : src.appUserLink.AppUserRequestedId.ToString()
            )
            .Map(
                dest => dest.DisplayName,
                src =>
                    src.appUser.Id == src.appUserLink.AppUserRequestedId
                        ? src.appUserLink.AppUserReceived.DisplayName
                        : src.appUserLink.AppUserRequested.DisplayName
            )
            .Map(
                dest => dest.PhotoUrl,
                src =>
                    src.appUser.Id == src.appUserLink.AppUserRequestedId
                        ? src.appUserLink.AppUserReceived.PhotoUrl
                        : src.appUserLink.AppUserRequested.PhotoUrl
            )
            .Map(
                dest => dest.UserName,
                src =>
                    src.appUser.Id == src.appUserLink.AppUserRequestedId
                        ? src.appUserLink.AppUserReceived.UserName
                        : src.appUserLink.AppUserRequested.UserName
            )
            .Map(dest => dest.BecameFriendsTime, src => src.appUserLink.BecameFriendsTime);
    }
}
