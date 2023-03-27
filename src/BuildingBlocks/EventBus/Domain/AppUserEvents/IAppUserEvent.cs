using Infrastructure.Contracts.Data;

namespace EventBus.Domain.AppUserEvents;

public interface IAppUserEvent
{
    Guid Id { get; }

    UserDto User { get; }
    // DateTime CreatedAt { get; }
    // List<string> Queues { get; }
}