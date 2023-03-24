using Projects.Domain.Entities;

namespace Projects.Domain.Common;

public interface IProjectItem : IProject
{
    public Guid ProjectId { get; set; }
    public Project Project { get; set; }
}