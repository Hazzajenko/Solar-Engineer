using EventBus.Common;

namespace EventBus.Domain.AppUserEvents.Responses;

public interface IAppUserEventResponse
{
    // Guid Id { get; }
    Guid UserId { get; }
    ServiceName ServiceName { get; }
}

public record UserCreated(Guid UserId, ServiceName ServiceName) : IAppUserEventResponse
{
}

public record UserUpdated(Guid UserId, ServiceName ServiceName) : IAppUserEventResponse
{
}

public record UserNoChange(Guid UserId, ServiceName ServiceName) : IAppUserEventResponse
{
}

public record UserDeleted(Guid UserId, ServiceName ServiceName) : IAppUserEventResponse
{
}