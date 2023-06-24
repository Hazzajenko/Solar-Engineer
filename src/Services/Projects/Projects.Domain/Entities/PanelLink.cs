using ApplicationCore.Interfaces;
using Projects.Domain.Common;

namespace Projects.Domain.Entities;

public class PanelLink : IEntity, IProjectItem, IUserObject
{
    public static string DefaultPanelConfigId = "Longi-Himo555m";

    private PanelLink(
        Guid id,
        Guid projectId,
        Guid stringId,
        Guid positivePanelId,
        Guid negativePanelId,
        IEnumerable<LinePoint> linePoints,
        Guid createdById
    )
    {
        Id = id;
        ProjectId = projectId;
        StringId = stringId;
        PositivePanelId = positivePanelId;
        NegativePanelId = negativePanelId;
        LinePoints = linePoints;
        CreatedById = createdById;
    }

    public PanelLink() { }

    public String String { get; set; } = default!;
    public Guid StringId { get; set; }
    public Panel PositivePanel { get; set; } = default!;
    public Panel NegativePanel { get; set; } = default!;
    public Guid PositivePanelId { get; set; }
    public Guid NegativePanelId { get; set; }
    public IEnumerable<LinePoint> LinePoints { get; set; } = default!;
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
        IEnumerable<LinePoint> linePoints,
        Guid createdById
    )
    {
        return new PanelLink(
            id,
            projectId,
            stringId,
            panelPositiveToId,
            panelNegativeToId,
            linePoints,
            createdById
        );
    }

    public class LinePoint
    {
        public LinePoint(double x, double y)
        {
            X = x;
            Y = y;
        }

        public LinePoint() { }

        public double X { get; set; }
        public double Y { get; set; }
    }
}
