using Infrastructure.Common;
using Projects.API.Data;

namespace Projects.API.Entities;

public class Panel : IEntity, IProjectItem, IUserObject
{
    public String String { get; set; } = default!;
    public Guid StringId { get; set; }
    public PanelConfig PanelConfig { get; set; } = default!;
    public Guid PanelConfigId { get; set; }
    public Guid Id { get; set; }
    public DateTime CreatedTime { get; set; }
    public DateTime LastModifiedTime { get; set; }
    public Guid ProjectId { get; set; }
    public Project Project { get; set; } = default!;
    public Guid CreatedById { get; set; }
}