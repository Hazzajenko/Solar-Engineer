using dotnetapi.Features.Users.Contracts.Requests;
using dotnetapi.Features.Users.Data;
using dotnetapi.Models.Entities;

namespace dotnetapi.Features.Users.Mapping;

public static class AppUserLinkMapper
{
    public static AppUserToUserDto ToUserToUserDto(this AppUserLink request, AppUser appUser)
    {
        var recipientUser = appUser.Id.Equals(request.AppUserReceivedId)
            ? request.AppUserRequested
            : request.AppUserReceived;

        return new AppUserToUserDto
        {
            Id = appUser.Id.Equals(request.AppUserReceivedId)
                ? request.AppUserRequestedId
                : request.AppUserReceivedId,
            UserName = appUser.Id.Equals(request.AppUserReceivedId)
                ? request.AppUserRequestedUserName
                : request.AppUserReceivedUserName,
            NickName = appUser.Id.Equals(request.AppUserReceivedId)
                ? request.AppUserRequestedNickName
                : request.AppUserReceivedNickName,
            ToUserStatusEvent = appUser.Id.Equals(request.AppUserReceivedId)
                ? request.AppUserRequestedStatusEvent
                : request.AppUserReceivedStatusEvent,
            ToUserStatusDate = appUser.Id.Equals(request.AppUserReceivedId)
                ? request.AppUserRequestedStatusDate
                : request.AppUserReceivedStatusDate,
            Created = recipientUser.Created,
            LastActive = recipientUser.LastActive,
            BecameFriendsTime = request.BecameFriendsTime,
            IsFriend = request.Friends,
            UserToUserStatus = request.UserToUserStatus,
            FirstName = recipientUser.FirstName,
            LastName = recipientUser.LastName,
            PhotoUrl = recipientUser.PhotoUrl
        };
    }

    public static AppUserLink ToEntity(
        this CreateAppUserLinkRequest _,
        AppUser appUser,
        AppUser recipient
    )
    {
        return new AppUserLink
        {
            AppUserRequested = appUser,
            AppUserRequestedId = appUser.Id,
            AppUserRequestedUserName = appUser.UserName!,
            AppUserRequestedNickName = appUser.UserName!,
            AppUserReceived = recipient,
            AppUserReceivedId = recipient.Id,
            AppUserReceivedUserName = recipient.UserName!,
            AppUserReceivedNickName = recipient.UserName!,
            Created = DateTime.Now,
            BecameFriendsTime = null,
            Friends = false,
            UserToUserStatus = UserToUserStatus.None
        };
    }

    public static AppUserLinkDto ToDto(this AppUserLink request)
    {
        return new AppUserLinkDto
        {
            Id = request.Id,
            AppUserRequestedId = request.AppUserRequestedId,
            AppUserRequestedUserName = request.AppUserRequestedUserName,
            AppUserRequestedNickName = request.AppUserRequestedNickName,
            AppUserReceivedId = request.AppUserReceivedId,
            AppUserReceivedUserName = request.AppUserReceivedUserName,
            AppUserReceivedNickName = request.AppUserReceivedNickName,
            Created = request.Created,
            BecameFriendsTime = request.BecameFriendsTime,
            Friends = request.Friends,
            UserToUserStatus = request.UserToUserStatus
        };
    }
}
//