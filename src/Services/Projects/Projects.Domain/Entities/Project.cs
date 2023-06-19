using Infrastructure.Common;
using Projects.Domain.Common;

namespace Projects.Domain.Entities;

public class Project : IEntity, IUserObject, IProject
{
    private Project(string name, string colour, Guid createdById)
    {
        Name = name;
        Colour = colour;
        CreatedById = createdById;
    }

    public Project() { }

    public string Name { get; set; } = default!;
    public ICollection<AppUserProject> AppUserProjects { get; set; } = default!;
    public ICollection<String> Strings { get; set; } = default!;

    // public String UndefinedString { get; set; } = default!;
    public Guid UndefinedStringId { get; set; }
    public ICollection<PanelLink> PanelLinks { get; set; } = default!;
    public ICollection<Panel> Panels { get; set; } = default!;

    public string Colour { get; set; } = default!;

    // public ProjectId Id { get; set; }
    public Guid Id { get; set; }

    // public ProjectId Id2 { get; set; } = default!;

    public DateTime CreatedTime { get; set; } = DateTime.UtcNow;
    public DateTime LastModifiedTime { get; set; } = DateTime.UtcNow;
    public Guid CreatedById { get; set; }

    public static Project Create(string name, string colour, Guid createdById)
    {
        return new Project(name, colour, createdById);
    }
}
