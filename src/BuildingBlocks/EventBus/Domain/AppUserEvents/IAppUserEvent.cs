using Infrastructure.Contracts.Data;

namespace EventBus.Domain.AppUserEvents;

public interface IAppUserEvent
{
    AppUserDto AppUser { get; set; }
}