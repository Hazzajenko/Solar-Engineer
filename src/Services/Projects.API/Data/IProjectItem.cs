using Projects.API.Entities;

namespace Projects.API.Data;

public interface IProjectItem : IProject
{
    public Guid ProjectId { get; set; }
    public Project Project { get; set; }
}