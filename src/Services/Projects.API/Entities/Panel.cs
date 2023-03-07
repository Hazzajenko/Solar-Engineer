﻿using Infrastructure.Common;
using Projects.API.Data;

namespace Projects.API.Entities;

public class Panel : IEntity, IProjectItem, IUserObject
{
    private Panel(
        Guid id,
        Guid projectId,
        Guid stringId,
        Guid panelConfigId,
        string location,
        int rotation,
        Guid createdById
    )
    {
        Id = id;
        ProjectId = projectId;
        StringId = stringId;
        PanelConfigId = panelConfigId;
        Location = location;
        Rotation = rotation;
        CreatedById = createdById;
    }

    public Panel()
    {
    }

    public String String { get; set; } = default!;
    public Guid StringId { get; set; }
    public PanelConfig PanelConfig { get; set; } = default!;
    public Guid PanelConfigId { get; set; }
    public string Location { get; set; } = default!;
    public int Rotation { get; set; }
    public Guid Id { get; set; }
    public DateTime CreatedTime { get; set; } = DateTime.UtcNow;
    public DateTime LastModifiedTime { get; set; } = DateTime.UtcNow;
    public Guid ProjectId { get; set; }
    public Project Project { get; set; } = default!;
    public Guid CreatedById { get; set; }

    public static Panel Create(
        Guid id,
        Guid projectId,
        Guid stringId,
        Guid panelConfigId,
        string location,
        int rotation,
        Guid createdById
    )
    {
        return new Panel(id, projectId, stringId, panelConfigId, location, rotation, createdById);
    }
}