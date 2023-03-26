using EventBus.Domain.ProjectsEvents;
using EventBus.Wolverine;

namespace Projects.API.Queues;

public static class QueueConfig
{
    /*var listenerQueues = new ListenerQueue[]
    {
        new("appuser-events"),
        new("project-event-responses", true)
    };
    var senderQueues = new SenderQueue[] { new("project-events", typeof(ProjectEvent)) };*/
    public static ListenerQueue[] ListenerQueues { get; } =
        { new("appuser-events"), new("project-event-responses", true) };

    // { new("appuser-event-responses", true), new("projects-events") };

    public static SenderQueue[] SenderQueues { get; } =
        { new("project-events", typeof(ProjectEvent)) };
    // { new("appuser-events", typeof(AppUserEvent)) };
}