namespace dotnetapi.Models.Entities;



public abstract class ProjectBaseEntity
{
    public virtual string Id { get; protected set; } = default!;
    public Project Project { get; set; } = default!;
}