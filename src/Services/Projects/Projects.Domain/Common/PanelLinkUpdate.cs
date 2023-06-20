using Projects.Domain.Entities;

namespace Projects.Domain.Common;

public class PanelLinkUpdate
{
    public required string Id { get; set; }
    public required PanelLinkChanges Changes { get; set; }
}

public class PanelLinkChanges
{
    public string? PanelPositiveToId { get; init; }
    public string? PanelNegativeToId { get; init; }
    public IEnumerable<PanelLink.Point>? Points { get; init; }
}
