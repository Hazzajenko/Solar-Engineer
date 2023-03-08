namespace Projects.API.Contracts.Requests.Panels;

public class PanelCreate
{
    public required string Id { get; init; }
    public required string ProjectId { get; init; }
    public required string StringId { get; init; }
    public required string Location { get; init; }
    public required string PanelConfigId { get; init; }
    public required int Rotation { get; init; } = 0;
}