using Projects.Domain.Common;

namespace Projects.Domain.Contracts.Data;

public class StringDto : IProjectItemDto
{
    public string Type { get; set; } = EntityType.String;
    public string Name { get; set; } = default!;
    public string Colour { get; set; } = default!;
    public bool Parallel { get; set; }
    public string ProjectId { get; set; } = default!;
    public string Id { get; set; } = default!;
    public DateTime CreatedTime { get; set; }
    public DateTime LastModifiedTime { get; set; }
    public string CreatedById { get; set; } = default!;
}