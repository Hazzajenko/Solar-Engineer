﻿using Infrastructure.Contracts.Data;

namespace EventBus.Domain.AppUserEvents.Events;

public class AppUserModifiedEvent : EventBase, IAppUserEvent
{
    public AppUserModifiedEvent(UserDto user)
    {
        User = user;
    }

    public UserDto User { get; set; }
}