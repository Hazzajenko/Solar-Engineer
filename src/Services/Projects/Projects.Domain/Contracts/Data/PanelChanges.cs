using Projects.Domain.Entities;

namespace Projects.Domain.Contracts.Data;

public class PanelChanges
{
    public Panel.Point? Location { get; init; }
    public string? StringId { get; set; }
    public string? PanelConfigId { get; init; }
    public int? Angle { get; init; }
}