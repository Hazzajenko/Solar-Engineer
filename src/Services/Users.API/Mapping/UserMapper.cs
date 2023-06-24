﻿using ApplicationCore.Entities;
using ApplicationCore.Interfaces;
using EventBus.Domain.AppUserEvents;

namespace Users.API.Mapping;

public static class UserMapper
{
    public static User ToUser(this IAppUserEvent request)
    {
        return new User
        {
            Id = request.User.Id,
            CreatedTime = request.User.CreatedTime,
            LastModifiedTime = DateTime.UtcNow,
            FirstName = request.User.FirstName,
            LastName = request.User.LastName,
            DisplayName = request.User.DisplayName,
            PhotoUrl = request.User.PhotoUrl
            // LastActiveTime = request.User.LastActiveTime
        };
    }

    public static T ToCustomUser<T>(this IAppUserEvent request)
        where T : IAppUser, new()
    {
        return new T
        {
            Id = request.User.Id,
            CreatedTime = request.User.CreatedTime,
            LastModifiedTime = DateTime.UtcNow,
            FirstName = request.User.FirstName,
            LastName = request.User.LastName,
            DisplayName = request.User.DisplayName,
            PhotoUrl = request.User.PhotoUrl
            // LastActiveTime = request.User.LastActiveTime
        };
    }
}

// IUser