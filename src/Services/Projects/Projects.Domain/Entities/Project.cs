using ErrorOr;
using Infrastructure.Common;
using Projects.Domain.Common;
using Projects.Domain.Common.Errors;

namespace Projects.Domain.Entities;

/*public sealed class ProjectId
{
    private ProjectId(Guid value)
    {
        Value = value;
    }

    public Guid Value { get; private set; }

    public static ErrorOr<ProjectId> Create(string projectId)
    {
        var guidResult = Guid.TryParse(projectId, out var guid);
        if (!guidResult)
        {
            return Errors.Guid.InvalidGuid;
        }
        return new ProjectId(guid);
    }

    public static ProjectId Create(Guid projectId)
    {
        return new ProjectId(projectId);
    }
}*/

public record ProjectId(Guid Value);

public class Project : IEntity, IUserObject, IProject
{
    private Project(string name, Guid createdById)
    {
        Name = name;
        CreatedById = createdById;
    }

    public Project()
    {
    }

    public string Name { get; set; } = default!;
    public ICollection<AppUserProject> AppUserProjects { get; set; } = default!;
    public ICollection<String> Strings { get; set; } = default!;
    public ICollection<PanelLink> PanelLinks { get; set; } = default!;
    public ICollection<Panel> Panels { get; set; } = default!;
    // public ProjectId Id { get; set; }
    public Guid Id { get; set; }
    // public ProjectId Id2 { get; set; } = default!;
    
    public DateTime CreatedTime { get; set; } = DateTime.UtcNow;
    public DateTime LastModifiedTime { get; set; } = DateTime.UtcNow;
    public Guid CreatedById { get; set; }

    public static Project Create(string name, Guid createdById)
    {
        return new Project(name, createdById);
    }
}