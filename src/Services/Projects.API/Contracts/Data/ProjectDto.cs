namespace Projects.API.Contracts.Data;

public class ProjectDto
{
    public string Id { get; set; } = default!;
    public string Name { get; set; } = default!;
    public string CreatedById { get; set; } = default!;
    public DateTime CreatedAt { get; set; }
}