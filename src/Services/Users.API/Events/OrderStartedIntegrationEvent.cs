using EventBus.Events;

namespace Users.API.Events;

public record OrderStartedIntegrationEvent : IntegrationEvent
{
    public OrderStartedIntegrationEvent(string userId)
    {
        UserId = userId;
    }

    public string UserId { get; init; }
}