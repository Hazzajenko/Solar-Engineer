using EventBus.Domain.AppUserEvents;
using EventBus.Wolverine;

namespace Identity.API.Queues;

public static class QueueConfig
{
    public static ListenerQueue[] ListenerQueues { get; } =
    {
        new("projects-events") /*, new("appuser-event-responses", true)*/
    };

    public static SenderQueue[] SenderQueues { get; } =
        { new("appuser-events", typeof(AppUserEvent)) };
}