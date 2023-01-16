﻿using dotnetapi.Models.Dtos;
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
}