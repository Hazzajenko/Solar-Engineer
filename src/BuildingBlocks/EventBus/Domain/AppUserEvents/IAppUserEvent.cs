using Infrastructure.Contracts.Data;

namespace EventBus.Domain.AppUserEvents;

public interface IAppUserEvent
{
    UserDto User { get; set; }
}