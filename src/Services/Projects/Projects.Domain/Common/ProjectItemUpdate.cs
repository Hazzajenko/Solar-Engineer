namespace Projects.Domain.Common;

public class ProjectItemUpdate
{
    public string Id { get; set; } = default!;
    public Dictionary<string, object?> Changes { get; set; } = default!;
}
