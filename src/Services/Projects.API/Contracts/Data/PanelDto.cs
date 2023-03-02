namespace Projects.API.Contracts.Data;

public class PanelDto
{
    public string StringId { get; set; } = default!;
    public string PanelConfigId { get; set; } = default!;
    public string Id { get; set; } = default!;
    public DateTime CreatedTime { get; set; }
    public DateTime LastModifiedTime { get; set; }
    public string ProjectId { get; set; } = default!;
}