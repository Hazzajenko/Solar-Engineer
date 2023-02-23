using Infrastructure.Common;

namespace Projects.API.Entities;

public class Project : IEntity {
    public Guid Id { get; set; }
    public DateTime CreatedTime { get; set; }
    public DateTime LastModifiedTime { get; set; }
    public string Name { get; set; } = default!;
}