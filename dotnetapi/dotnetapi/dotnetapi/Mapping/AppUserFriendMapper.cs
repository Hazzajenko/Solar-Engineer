using dotnetapi.Models.Dtos;
using dotnetapi.Models.Entities;

namespace dotnetapi.Mapping;

public static class AppUserFriendMapper
{
    public static AppUserFriendDto ToDto(this AppUserFriend request)
    {
        return new AppUserFriendDto
        {
            RequestedById = request.RequestedById,
            RequestedToId = request.RequestedToId,
            RequestedByUsername = request.RequestedBy.UserName!,
            RequestedToUsername = request.RequestedTo.UserName!,
            FriendRequestFlag = request.FriendRequestFlag,
            RequestTime = request.RequestTime,
            BecameFriendsTime = request.BecameFriendsTime
        };
    }

    public static AppUserFriend ToEntity(this AppUserFriendDto request, AppUser requestedBy, AppUser requestedTo)
    {
        return new AppUserFriend
        {
            RequestedBy = requestedBy,
            RequestedTo = requestedTo,
            RequestedById = request.RequestedById,
            RequestedToId = request.RequestedToId,
            FriendRequestFlag = request.FriendRequestFlag,
            RequestTime = request.RequestTime,
            BecameFriendsTime = request.BecameFriendsTime
        };
    }
}