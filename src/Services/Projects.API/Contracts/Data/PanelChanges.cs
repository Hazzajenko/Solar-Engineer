namespace Projects.API.Contracts.Data;

public class PanelChanges
{
    public string? Location { get; init; }
    public string? PanelConfigId { get; init; }
    public int? Rotation { get; init; }
}