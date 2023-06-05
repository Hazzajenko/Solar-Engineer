using Projects.Domain.Entities;

namespace Projects.Domain.Common;

public class PanelUpdate
{
    public required string Id { get; set; }
    public required PanelChanges Changes { get; set; }
}

public class PanelChanges
{
    public Panel.Point? Location { get; init; }
    public string? StringId { get; set; }
    public string? PanelConfigId { get; init; }
    public double? Angle { get; init; }
}