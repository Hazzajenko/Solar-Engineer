using Projects.Domain.Entities;

namespace Projects.Contracts.Data;

public class PanelLinkDto : IProjectItemDto
{
    public string Type { get; set; } = EntityType.PanelLink;
    public string StringId { get; set; } = default!;
    public string PositivePanelId { get; set; } = default!;
    public string NegativePanelId { get; set; } = default!;

    public IEnumerable<PanelLink.LinePoint> LinePoints { get; set; } = default!;
    public string ProjectId { get; set; } = default!;
    public string Id { get; set; } = default!;
    public DateTime CreatedTime { get; set; }
    public DateTime LastModifiedTime { get; set; }
    public string CreatedById { get; set; } = default!;
}
