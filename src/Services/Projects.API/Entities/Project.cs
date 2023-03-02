using Infrastructure.Common;

namespace Projects.API.Entities;

public class Project : IEntity, IUserObject
{
    public string Name { get; set; } = default!;
    public ICollection<AppUserProject> AppUserProjects { get; set; } = default!;
    public Guid Id { get; set; }
    public DateTime CreatedTime { get; set; } = DateTime.UtcNow;
    public DateTime LastModifiedTime { get; set; }
    public Guid CreatedById { get; set; }
}