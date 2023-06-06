namespace Projects.Contracts.Data;

public class PanelLinkDto : IProjectItemDto
{
    public string Type { get; set; } = EntityType.PanelLink;
    public string PanelPositiveToId { get; set; } = default!;

    public string PanelNegativeToId { get; set; } = default!;

    // public Guid PanelPositiveToId { get; set; }
    // public Guid PanelNegativeToId { get; set; }
    public string ProjectId { get; set; } = default!;
    public string Id { get; set; } = default!;
    public DateTime CreatedTime { get; set; }
    public DateTime LastModifiedTime { get; set; }
    public string CreatedById { get; set; } = default!;
}