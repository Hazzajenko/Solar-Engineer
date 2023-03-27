using EventBus.Common;

namespace EventBus.Domain.AppUserEvents.Responses;

public interface IAppUserEventResponse
{
    Guid Id { get; }

    // Guid UserId { get; }
    ServiceName ServiceName { get; }
}

public record UserCreated(Guid Id, ServiceName ServiceName) : IAppUserEventResponse
{
}

public record UserUpdated(Guid Id, ServiceName ServiceName) : IAppUserEventResponse
{
}

public record UserNoChange(Guid Id, ServiceName ServiceName) : IAppUserEventResponse
{
}

public record UserDeleted(Guid Id, ServiceName ServiceName) : IAppUserEventResponse
{
}