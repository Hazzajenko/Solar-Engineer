using Infrastructure.Common;

namespace Projects.API.Entities;

public class PanelLink : IEntity
{
    public String String { get; set; } = default!;
    public string StringId { get; set; } = default!;
    public Panel PositiveTo { get; set; } = default!;
    public Panel NegativeTo { get; set; } = default!;
    public string PositiveToId { get; set; } = default!;
    public string NegativeToId { get; set; } = default!;
    public bool IsDisconnectionPoint { get; set; } = false;
    public Panel? DisconnectionPointPanel { get; set; }
    public string? DisconnectionPointPanelId { get; set; }
    public Guid Id { get; set; }
    public DateTime CreatedTime { get; set; }
    public DateTime LastModifiedTime { get; set; }
}