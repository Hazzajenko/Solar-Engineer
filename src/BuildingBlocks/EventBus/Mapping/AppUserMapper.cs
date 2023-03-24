﻿using EventBus.Domain.AppUserEvents;
using Infrastructure.Common.User;

// using Infrastructure.Entities.Identity;

namespace EventBus.Mapping;

public static class AppUserMapper
{
    public static AppUserEventFactory ToEvent(this IUser request)
    {
        return new AppUserEventFactory
            (request);
    }
}