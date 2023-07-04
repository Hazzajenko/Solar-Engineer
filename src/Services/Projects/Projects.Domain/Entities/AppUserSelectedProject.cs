using ApplicationCore.Interfaces;

namespace Projects.Domain.Entities;

public class AppUserSelectedProject : IEntity
{
    public Guid Id { get; set; }
    public Guid? ProjectId { get; set; }
    public DateTime CreatedTime { get; set; }
    public DateTime LastModifiedTime { get; set; }
}
