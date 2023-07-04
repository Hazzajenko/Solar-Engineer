using ApplicationCore.Interfaces;
using Projects.Domain.Common;

namespace Projects.Domain.Entities;

public class AppUserProject : IEntityToEntity, IProjectItem
{
    private AppUserProject(
        Project project,
        Guid appUserId,
        string role,
        bool canCreate,
        bool canDelete,
        bool canInvite,
        bool canKick
    )
    {
        Project = project;
        ProjectId = project.Id;
        AppUserId = appUserId;
        Role = role;
        CanCreate = canCreate;
        CanDelete = canDelete;
        CanInvite = canInvite;
        CanKick = canKick;
    }

    private AppUserProject(
        Guid projectId,
        Guid appUserId,
        string role,
        bool canCreate,
        bool canDelete,
        bool canInvite,
        bool canKick
    )
    {
        ProjectId = projectId;
        AppUserId = appUserId;
        Role = role;
        CanCreate = canCreate;
        CanDelete = canDelete;
        CanInvite = canInvite;
        CanKick = canKick;
    }

    public AppUserProject() { }

    // public Guid AppUserId { get; set; }
    public string Role { get; set; } = "Member";
    public bool CanCreate { get; set; } = true;
    public bool CanDelete { get; set; } = true;
    public bool CanInvite { get; set; } = true;
    public bool CanKick { get; set; } = true;

    public Guid AppUserId { get; set; }

    public ProjectUser ProjectUser { get; set; } = default!;
    public DateTime CreatedTime { get; set; } = DateTime.UtcNow;
    public DateTime LastModifiedTime { get; set; } = DateTime.UtcNow;
    public Guid ProjectId { get; set; }
    public Project Project { get; set; } = default!;

    public static AppUserProject Create(
        Guid projectId,
        Guid projectUserId,
        string role,
        bool canCreate = true,
        bool canDelete = true,
        bool canInvite = true,
        bool canKick = true
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

    public static AppUserProject CreateAsOwner(Guid projectUserId, string name, string colour)
    {
        var project = Project.Create(name, colour, projectUserId);

        return new AppUserProject(project, projectUserId, "Owner", true, true, true, true);
    }
    /*{
        var project = Project.Create(projectName, projectUserId);

        return new AppUserProject(project, projectUserId, "Admin", true, true, true, true);
    }*/
}
