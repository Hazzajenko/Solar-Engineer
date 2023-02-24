using Infrastructure.Common;

namespace Projects.API.Entities;

public class AppUserProject : IEntity
{
    public Guid AppUserId { get; set; } = default!;
    public Guid ProjectId { get; set; } = default!;
    public Project Project { get; set; } = default!;
    public string Role { get; set; } = default!;
    public bool CanCreate { get; set; }
    public bool CanDelete { get; set; }
    public bool CanInvite { get; set; }
    public bool CanKick { get; set; }
    public Guid Id { get; set; }
    public DateTime CreatedTime { get; set; }
    public DateTime LastModifiedTime { get; set; }
}