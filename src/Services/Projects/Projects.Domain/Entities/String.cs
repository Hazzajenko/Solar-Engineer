using ApplicationCore.Extensions;
using ApplicationCore.Interfaces;
using Projects.Domain.Common;

namespace Projects.Domain.Entities;

public class String : IEntity, IProjectItem, IUserObject
{
    public static readonly string UndefinedStringId = "UNDEFINED_STRING_ID";
    public static readonly string UndefinedStringName = "UNDEFINED_STRING";
    public static readonly string DefaultPanelFillStyle = "#8ED6FF";

    private String(
        Guid id,
        Guid projectId,
        Guid appUserId,
        string name,
        string colour,
        bool parallel,
        List<Panel> panels = null!
    )
    {
        Id = id;
        ProjectId = projectId;
        CreatedById = appUserId;
        Name = name;
        Colour = colour;
        Parallel = parallel;
    }

    private String(
        Guid projectId,
        Guid appUserId,
        string name,
        string colour,
        bool parallel,
        List<Panel>? panels = null!
    )
    {
        ProjectId = projectId;
        CreatedById = appUserId;
        Name = name;
        Colour = colour;
        Parallel = parallel;
        Panels = panels ?? new List<Panel>();
    }

    public String() { }

    public string Name { get; set; } = default!;
    public string Colour { get; set; } = default!;
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
        (string Id, string Name, string Colour) request,
        Guid projectId,
        Guid appUserId
    )
    {
        return new String(
            request.Id.ToGuid(),
            projectId,
            appUserId,
            request.Name,
            request.Colour,
            false
        );
    }

    public static String CreateUndefined(Guid projectId, Guid appUserId)
    {
        return new String(
            Guid.NewGuid(),
            projectId,
            appUserId,
            UndefinedStringName,
            DefaultPanelFillStyle,
            false
        );
    }

    public static String CreateUndefinedStringFromProject(AppUserProject appUserProject)
    {
        return new String(
            appUserProject.Project.UndefinedStringId,
            appUserProject.ProjectId,
            appUserProject.AppUserId,
            UndefinedStringName,
            DefaultPanelFillStyle,
            false
        );
    }
}
