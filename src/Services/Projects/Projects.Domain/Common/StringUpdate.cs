namespace Projects.Domain.Common;

public class StringUpdate
{
    public required string Id { get; set; }
    public required StringChanges Changes { get; set; }
}

public class StringChanges
{
    public string? Name { get; set; }
    public string? Colour { get; init; }
    public bool? Parallel { get; init; }
}