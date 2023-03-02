using Infrastructure.Common;
using Projects.API.Data;

namespace Projects.API.Entities;

public class PanelLink : IEntity, IProjectItem
{
    public String String { get; set; } = default!;
    public Guid StringId { get; set; }
    public Panel PositiveTo { get; set; } = default!;
    public Panel NegativeTo { get; set; } = default!;
    public Guid PositiveToId { get; set; }
    public Guid NegativeToId { get; set; }

    // public bool IsDisconnectionPoint { get; set; } = false;
    // public Panel? DisconnectionPointPanel { get; set; }
    // public string? DisconnectionPointPanelId { get; set; }
    public Guid Id { get; set; }
    public DateTime CreatedTime { get; set; }
    public DateTime LastModifiedTime { get; set; }
    public Guid ProjectId { get; set; }
    public Project Project { get; set; } = default!;
}