using Infrastructure.Common;
using Infrastructure.Extensions;
using Projects.Domain.Common;

namespace Projects.Domain.Entities;

public class String : IEntity, IProjectItem, IUserObject
{
    private String(
        Guid id,
        Guid projectId,
        Guid appUserId,
        string name,
        string color,
        bool parallel,
        List<Panel> panels = null!
    )
    {
        Id = id;
        ProjectId = projectId;
        CreatedById = appUserId;
        Name = name;
        Color = color;
        Parallel = parallel;
    }

    private String(
        Guid projectId,
        Guid appUserId,
        string name,
        string color,
        bool parallel,
        List<Panel>? panels = null!
    )
    {
        ProjectId = projectId;
        CreatedById = appUserId;
        Name = name;
        Color = color;
        Parallel = parallel;
        Panels = panels ?? new List<Panel>();
    }

    public String()
    {
    }

    public string Name { get; set; } = default!;
    public string Color { get; set; } = default!;
    public bool Parallel { get; set; }
    public ICollection<Panel> Panels { get; set; } = default!;
    public ICollection<PanelLink> PanelLinks { get; set; } = default!;
    public Guid Id { get; set; }
    public DateTime CreatedTime { get; set; } = DateTime.UtcNow;
    public DateTime LastModifiedTime { get; set; } = DateTime.UtcNow;
    public Guid ProjectId { get; set; }
    public Project Project { get; set; } = default!;
    public Guid CreatedById { get; set; }

    public static String Create(
        (string Id, string Name, string Color) request,
        Guid projectId,
        Guid appUserId
    )
    {
        return new String(
            request.Id.ToGuid(),
            projectId,
            appUserId,
            request.Name,
            request.Color,
            false
        );
    }

    public static String CreateUndefined(Guid projectId, Guid appUserId)
    {
        return new String(Guid.NewGuid(), projectId, appUserId, "undefined", "#808080", false);
    }
}