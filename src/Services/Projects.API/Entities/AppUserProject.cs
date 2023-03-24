﻿using Infrastructure.Common;
using Projects.API.Data;

namespace Projects.API.Entities;

public class AppUserProject : IEntityToEntity, IProjectItem
{
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

    public AppUserProject()
    {
    }

    public Guid AppUserId { get; set; }
    public string Role { get; set; } = "Member";
    public bool CanCreate { get; set; }
    public bool CanDelete { get; set; }
    public bool CanInvite { get; set; }

    public bool CanKick { get; set; }

    // public Guid Id { get; set; }
    public DateTime CreatedTime { get; set; } = DateTime.UtcNow;
    public DateTime LastModifiedTime { get; set; } = DateTime.UtcNow;
    public Guid ProjectId { get; set; }
    public Project Project { get; set; } = default!;

    public static AppUserProject Create(
        Guid projectId,
        Guid appUserId,
        string role,
        bool canCreate = false,
        bool canDelete = false,
        bool canInvite = false,
        bool canKick = false
    )
    {
        return new AppUserProject(
            projectId,
            appUserId,
            role,
            canCreate,
            canDelete,
            canInvite,
            canKick
        );
    }
}