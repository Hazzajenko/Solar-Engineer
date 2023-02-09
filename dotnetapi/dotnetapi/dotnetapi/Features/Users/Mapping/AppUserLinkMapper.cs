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
            Id = recipientUser.Id,
            DisplayName = recipientUser.DisplayName,
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

    // AppUserFriendDto

    public static RecipientUserFriendDto ToRecipientFriendDto(
        this AppUserLink request,
        AppUser appUser
    )
    {
        var recipientUser = appUser.Id.Equals(request.AppUserReceivedId)
            ? request.AppUserRequested
            : request.AppUserReceived;
        return new RecipientUserFriendDto
        {
            Id = recipientUser.Id,
            DisplayName = recipientUser.DisplayName,
            PhotoUrl = recipientUser.PhotoUrl,
            LastActive = recipientUser.LastActive
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
            AppUserRequestedDisplayName = request.AppUserRequestedUserName,
            AppUserRequestedNickName = request.AppUserRequestedNickName,
            AppUserReceivedId = request.AppUserReceivedId,
            AppUserReceivedDisplayName = request.AppUserReceivedUserName,
            AppUserReceivedNickName = request.AppUserReceivedNickName,
            Created = request.Created,
            BecameFriendsTime = request.BecameFriendsTime,
            Friends = request.Friends,
            UserToUserStatus = request.UserToUserStatus
        };
    }
}
/*//
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
        DisplayName = appUser.Id.Equals(request.AppUserReceivedId)
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
}*/