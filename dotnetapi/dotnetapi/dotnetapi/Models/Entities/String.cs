namespace dotnetapi.Models.Entities;

public class String : ProjectBaseEntity
{
    public AppUser CreatedBy { get; set; } = default!;
    public DateTime CreatedAt { get; set; }
    public ICollection<Panel> Panels { get; set; } = default!;
    public ICollection<PanelLink> PanelLinks { get; set; } = default!;
    public string Name { get; set; } = default!;
    public bool IsInParallel { get; set; }
}