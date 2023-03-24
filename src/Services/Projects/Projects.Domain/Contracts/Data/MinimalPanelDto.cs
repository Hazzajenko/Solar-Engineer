using Projects.Domain.Common;

namespace Projects.Domain.Contracts.Data;

public class MinimalPanelDto : IProjectItemDto
{
    public int Rotation { get; set; }
    public string Location { get; set; } = default!;
    public string Id { get; set; } = default!;
    public DateTime CreatedTime { get; set; }
    public DateTime LastModifiedTime { get; set; }
    public string CreatedById { get; set; } = default!;
}