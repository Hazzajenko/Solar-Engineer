using dotnetapi.Models.Dtos;
using dotnetapi.Models.Entities;

namespace dotnetapi.Mapping;

public static class AppUserFriendMapper
{
    public static FriendRequestDto ToDto(this AppUserFriend request)
    {
        return new FriendRequestDto
        {
            /*RequestedById = request.RequestedById,
            RequestedToId = request.RequestedToId,*/
            RequestedByUsername = request.RequestedBy.UserName!,
            RequestedToUsername = request.RequestedTo.UserName!,
            FriendRequestFlag = request.FriendRequestFlag,
            // RequestTime = request.RequestTime,
            BecameFriendsTime = request.BecameFriendsTime
        };
    }

    public static AppUserFriend ToEntity(this FriendRequestDto request, AppUser requestedBy, AppUser requestedTo)
    {
        return new AppUserFriend
        {
            RequestedBy = requestedBy,
            RequestedTo = requestedTo,
            // RequestedById = request.RequestedById,
            // RequestedToId = request.RequestedToId,
            FriendRequestFlag = request.FriendRequestFlag,
            // RequestTime = request.RequestTime,
            BecameFriendsTime = request.BecameFriendsTime
        };
    }

    public static AppUserFriendDto ToAppUserFriendDto(this AppUserFriend request)
    {
        return new AppUserFriendDto
        {
            Id = request.Id,
            RequestedByUsername = request.RequestedBy.UserName!,
            RequestedToUsername = request.RequestedTo.UserName!,
            Status = request.Status,
            Type = request.Type,
            RequestTime = request.RequestTime,
            FriendRequestFlag = request.FriendRequestFlag,
            BecameFriendsTime = request.BecameFriendsTime
        };
    }

    public static NotificationDto ToNotificationDto(this AppUserFriend request)
    {
        return new NotificationDto
        {
            Id = request.Id,
            // RequestedByUsername = request.RequestedBy.UserName!,
            // RequestedToUsername = request.RequestedTo.UserName!,
            Status = request.Status,
            Type = request.Type,
            Username = request.RequestedTo.UserName!,
            RequestTime = request.RequestTime,
            FriendRequest = new FriendRequestDto
            {
                BecameFriendsTime = request.BecameFriendsTime,
                FriendRequestFlag = request.FriendRequestFlag,
                RequestedByUsername = request.RequestedBy.UserName!,
                RequestedToUsername = request.RequestedTo.UserName!
            }
            // RequestTime = request.RequestTime,
            // FriendRequestFlag = request.FriendRequestFlag,
            // BecameFriendsTime = request.BecameFriendsTime
        };
    }

    public static FriendDto ToFriendDtoFromSent(this AppUserFriend request)
    {
        return new FriendDto
        {
            Username = request.RequestedTo.UserName!,
            BecameFriendsTime = request.BecameFriendsTime
        };
    }

    public static FriendDto ToFriendDtoFromReceived(this AppUserFriend request)
    {
        return new FriendDto
        {
            Username = request.RequestedBy.UserName!,
            BecameFriendsTime = request.BecameFriendsTime
        };
    }

    public static FriendRequestDto ToFriendRequestDto(this FriendRequest request)
    {
        return new FriendRequestDto
        {
            RequestedByUsername = request.RequestedBy.UserName!,
            FriendRequestFlag = request.FriendRequestFlag,
            RequestedToUsername = request.RequestedTo.UserName!,
            BecameFriendsTime = request.BecameFriendsTime
        };
    }
}