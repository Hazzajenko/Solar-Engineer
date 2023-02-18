using EventBus.Domain;

namespace EventBus.Services;

public interface IEventPublisherService
{
    Task PublishAsync<T>(T eventBase)
        where T : IEventBase;
}