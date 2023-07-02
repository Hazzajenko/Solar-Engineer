using ApplicationCore.Interfaces;
using Projects.Domain.Common;

namespace Projects.Domain.Entities;

public class Panel : IEntity, IProjectItem, IUserObject
{
    private Panel(
        Guid id,
        Guid projectId,
        Guid stringId,
        Guid panelConfigId,
        Point location,
        double angle,
        Guid createdById
    )
    {
        Id = id;
        ProjectId = projectId;
        StringId = stringId;
        PanelConfigId = panelConfigId;
        Location = location;
        Angle = angle;
        CreatedById = createdById;
    }

    private Panel(
        Guid projectId,
        Guid stringId,
        Guid panelConfigId,
        Point location,
        double angle,
        Guid createdById
    )
    {
        ProjectId = projectId;
        StringId = stringId;
        PanelConfigId = panelConfigId;
        Location = location;
        Angle = angle;
        CreatedById = createdById;
    }


    public Panel() { }

    public String String { get; set; } = default!;
    public Guid StringId { get; set; }
    public PanelConfig PanelConfig { get; set; } = default!;

    public Guid PanelConfigId { get; set; }

    public Point Location { get; set; } = default!;
    public double Angle { get; set; }
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
        Point location,
        double angle,
        Guid createdById
    )
    {
        return new Panel(id, projectId, stringId, panelConfigId, location, angle, createdById);
    }
    
    public Panel ChangeStringId(Guid stringId)
    {
        StringId = stringId;
        return this;
    }
    
    
    //
    // public static Panel AddStringId(Panel panel, Guid stringId)
    // {
    //     panel.StringId = stringId;
    //     return panel;
    // }

    public class Point
    {
        public Point(double x, double y)
        {
            X = x;
            Y = y;
        }

        public double X { get; set; }
        public double Y { get; set; }
    }
}
