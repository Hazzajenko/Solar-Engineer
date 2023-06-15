using System.Text.Json;

// using Infrastructure.Entities.Identity;

namespace EventBus.Domain.ProjectsEvents;

public class ProjectEvent : IEventBase, IProjectEvent
{
    public ProjectEvent(Guid projectId, ProjectEventType projectEventType)
    {
        ProjectId = projectId;
        ProjectEventType = projectEventType;
        Queues = new List<string> { "identity" };
        CreatedAt = DateTime.UtcNow;
    }

    public ProjectEvent(Guid projectId, ProjectEventType projectEventType, object data)
    {
        ProjectId = projectId;
        ProjectEventType = projectEventType;
        Queues = new List<string> { "identity" };
        CreatedAt = DateTime.UtcNow;
        Data = JsonSerializer.Serialize(data);
        DataType = data.GetType().ToString();
    }

    /*public ProjectEvent(Guid projectId, ProjectEventType projectEventType, T data)
    {
        ProjectId = projectId;
        ProjectEventType = projectEventType;
        Queues = new List<string> { "identity" };
        CreatedAt = DateTime.UtcNow;
        if (data is null) throw new ArgumentNullException(nameof(data));
        Data = JsonSerializer.Serialize(data);
        DataType = data.GetType().ToString();
    }*/

    public ProjectEventType ProjectEventType { get; set; }
    public string Data { get; set; } = string.Empty;
    public string DataType { get; set; } = string.Empty;

    public Guid ProjectId { get; set; }
    public string EventType => ProjectEventType.ToString();
    public DateTime CreatedAt { get; }
    public List<string> Queues { get; set; }
}