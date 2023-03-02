using Infrastructure.Common;
using Projects.API.Data;

namespace Projects.API.Entities;

public class String : IEntity, IProjectItem
{
    public string Name { get; set; } = default!;
    public string Color { get; set; } = default!;
    public bool Parallel { get; set; }
    public Guid Id { get; set; }
    public DateTime CreatedTime { get; set; }
    public DateTime LastModifiedTime { get; set; }
    public Guid ProjectId { get; set; }
    public Project Project { get; set; } = default!;
}