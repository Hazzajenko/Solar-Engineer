namespace dotnetapi.Models.Entities;

public abstract class ProjectBaseEntity
{
    public string Id { get; set; } = default!;
    public Project Project { get; set; } = default!;
    public int ProjectId { get; set; } = default!;
}