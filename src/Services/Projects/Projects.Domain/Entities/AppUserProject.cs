using Infrastructure.Common;
using Projects.Domain.Common;

namespace Projects.Domain.Entities;

public class AppUserProject : IEntityToEntity, IProjectItem
{
    private AppUserProject(
        Guid projectId,
        Guid projectUserId,
        string role,
        bool canCreate,
        bool canDelete,
        bool canInvite,
        bool canKick
    )
    {
        ProjectId = projectId;
        ProjectUserId = projectUserId;
        Role = role;
        CanCreate = canCreate;
        CanDelete = canDelete;
        CanInvite = canInvite;
        CanKick = canKick;
    }

    public AppUserProject()
    {
    }

    // public Guid AppUserId { get; set; }
    public string Role { get; set; } = "Member";
    public bool CanCreate { get; set; }
    public bool CanDelete { get; set; }
    public bool CanInvite { get; set; }

    public bool CanKick { get; set; }
    public Guid ProjectUserId { get; set; }
    public ProjectUser ProjectUser { get; set; } = default!;
    public DateTime CreatedTime { get; set; } = DateTime.UtcNow;
    public DateTime LastModifiedTime { get; set; } = DateTime.UtcNow;
    public Guid ProjectId { get; set; }
    public Project Project { get; set; } = default!;

    public static AppUserProject Create(
        Guid projectId,
        Guid projectUserId,
        string role,
        bool canCreate = false,
        bool canDelete = false,
        bool canInvite = false,
        bool canKick = false
    )
    {
        return new AppUserProject(
            projectId,
            projectUserId,
            role,
            canCreate,
            canDelete,
            canInvite,
            canKick
        );
    }
}