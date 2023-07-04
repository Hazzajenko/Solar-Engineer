using ApplicationCore.Interfaces;

namespace Projects.Domain.Entities;

public class ProjectUser : IEntity
{
    public ProjectUser(Guid id)
    {
        Id = id;
        CreatedTime = DateTime.UtcNow;
        LastModifiedTime = DateTime.UtcNow;
    }

    public ProjectUser() { }

    public ICollection<AppUserProject> AppUserProjects { get; set; } = default!;
    public Guid? SelectedProjectId { get; set; }

    public Guid Id { get; set; }
    public DateTime CreatedTime { get; set; } = DateTime.UtcNow;
    public DateTime LastModifiedTime { get; set; } = DateTime.UtcNow;
}
