namespace Projects.Domain.Common;

public class ProjectItemUpdate
{
    public string Id { get; set; } = default!;
    public Dictionary<string, object?> Changes { get; set; } = default!;
}

public class ProjectItemUpdateRequest<TChanges>
{
    public string Id { get; set; } = default!;
    public TChanges Changes { get; set; } = default!;
}
