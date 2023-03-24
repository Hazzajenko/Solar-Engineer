using Infrastructure.Common;
using Projects.Domain.Common;

namespace Projects.Domain.Entities;

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

    private Panel(
        Guid projectId,
        Guid stringId,
        Guid panelConfigId,
        string location,
        int rotation,
        Guid createdById
    )
    {
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
    public PanelLink? LinkPositiveTo { get; set; }
    public PanelLink? LinkNegativeTo { get; set; }
    public Guid? LinkPositiveToId { get; set; }
    public Guid? LinkNegativeToId { get; set; }
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

    // public
    // method that changes the stringId

    public static Panel AddStringId(Panel panel, Guid stringId)
    {
        panel.StringId = stringId;
        return panel;
    }

    /*
    public static Panel CreateV2(PanelOptions options)
    {
        return new Panel(
            options.Id,
            options.ProjectId,
            options.StringId,
            options.PanelConfigId,
            options.Location,
            options.Rotation,
            options.CreatedById
        );
        // return new Panel(id, projectId, stringId, panelConfigId, location, rotation, createdById);
    }

    public class PanelOptions
    {
        public Guid Id { get; set; }
        public Guid ProjectId { get; set; }
        public Guid StringId { get; set; }
        public Guid PanelConfigId { get; set; }
        public string Location { get; set; } = default!;
        public int Rotation { get; set; }
        public Guid CreatedById { get; set; }
    }*/
}