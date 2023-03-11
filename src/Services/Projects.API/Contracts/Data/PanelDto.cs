using Projects.API.Common;

namespace Projects.API.Contracts.Data;

public class PanelDto : IProjectItemDto
{
    public string Type { get; set; } = BlockType.Panel;
    public string StringId { get; set; } = default!;
    public string PanelConfigId { get; set; } = default!;
    public string ProjectId { get; set; } = default!;
    public string Location { get; set; } = default!;
    public int Rotation { get; set; }
    public string Id { get; set; } = default!;
    public DateTime CreatedTime { get; set; }
    public DateTime LastModifiedTime { get; set; }
    public string CreatedById { get; set; } = default!;
}