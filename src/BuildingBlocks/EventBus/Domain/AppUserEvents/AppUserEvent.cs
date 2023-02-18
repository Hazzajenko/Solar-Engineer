using EventBus.Domain.AppUserEvents.Events;
using Infrastructure.Common;
using Infrastructure.Contracts.Data;
using Infrastructure.Mapping;
// using Infrastructure.Entities.Identity;

namespace EventBus.Domain.AppUserEvents;

public abstract class AppUserEvent: EventBase, IAppUserEvent
{
    public UserDto User { get; set; } = default!;
}