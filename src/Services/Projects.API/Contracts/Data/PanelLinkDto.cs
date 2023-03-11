using Projects.API.Common;

namespace Projects.API.Contracts.Data;

public class PanelLinkDto : IProjectItemDto
{
    public string Type { get; set; } = EntityType.PanelLink;
    public string PositiveToId { get; set; } = default!;
    public string NegativeToId { get; set; } = default!;
    public string ProjectId { get; set; } = default!;
    public string Id { get; set; } = default!;
    public DateTime CreatedTime { get; set; }
    public DateTime LastModifiedTime { get; set; }
    public string CreatedById { get; set; } = default!;
}