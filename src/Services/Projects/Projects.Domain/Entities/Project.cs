using Infrastructure.Common;
using Projects.Domain.Common;

namespace Projects.Domain.Entities;

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
    public Guid Id { get; set; }
    public DateTime CreatedTime { get; set; } = DateTime.UtcNow;
    public DateTime LastModifiedTime { get; set; } = DateTime.UtcNow;
    public Guid CreatedById { get; set; }

    public static Project Create(string name, Guid createdById)
    {
        return new Project(name, createdById);
    }
}