using Infrastructure.Common;
using Projects.API.Data;

namespace Projects.API.Entities;

public class String : IEntity, IProjectItem, IUserObject
{
    public string Name { get; set; } = default!;
    public string Color { get; set; } = default!;
    public bool Parallel { get; set; }
    public ICollection<Panel> Panels { get; set; } = new List<Panel>();
    public Guid Id { get; set; }
    public DateTime CreatedTime { get; set; }
    public DateTime LastModifiedTime { get; set; }
    public Guid ProjectId { get; set; }
    public Project Project { get; set; } = default!;
    public Guid CreatedById { get; set; }
}