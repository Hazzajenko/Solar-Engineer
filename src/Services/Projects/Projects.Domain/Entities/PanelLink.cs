using Infrastructure.Common;
using Projects.Domain.Common;

namespace Projects.Domain.Entities;

public class PanelLink : IEntity, IProjectItem, IUserObject
{
    public static string DefaultPanelConfigId = "Longi-Himo555m";

    private PanelLink(
        Guid id,
        Guid projectId,
        Guid stringId,
        Guid panelPositiveToId,
        Guid panelNegativeToId,
        Guid createdById
    )
    {
        Id = id;
        ProjectId = projectId;
        StringId = stringId;
        PanelPositiveToId = panelPositiveToId;
        PanelNegativeToId = panelNegativeToId;
        CreatedById = createdById;
    }

    public PanelLink()
    {
    }

    public String String { get; set; } = default!;
    public Guid StringId { get; set; }
    public Panel PanelPositiveTo { get; set; } = default!;
    public Panel PanelNegativeTo { get; set; } = default!;
    public Guid PanelPositiveToId { get; set; }
    public Guid PanelNegativeToId { get; set; }
    public IEnumerable<Point> Points { get; set; } = default!;
    public Guid Id { get; set; }
    public DateTime CreatedTime { get; set; } = DateTime.UtcNow;
    public DateTime LastModifiedTime { get; set; } = DateTime.UtcNow;
    public Guid ProjectId { get; set; }
    public Project Project { get; set; } = default!;
    public Guid CreatedById { get; set; }

    public static PanelLink Create(
        Guid id,
        Guid projectId,
        Guid stringId,
        Guid panelPositiveToId,
        Guid panelNegativeToId,
        Guid createdById
    )
    {
        return new PanelLink(
            id,
            projectId,
            stringId,
            panelPositiveToId,
            panelNegativeToId,
            createdById
        );
    }
    
    public class Point
    {
        public Point(double x, double y)
        {
            X = x;
            Y = y;
        }

        public Point()
        {
        }

        public double X { get; set; }
        public double Y { get; set; }
    }
}