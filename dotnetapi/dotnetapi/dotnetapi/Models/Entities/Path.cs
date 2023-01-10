namespace dotnetapi.Models.Entities;

public class Path : ProjectBaseEntity
{
    public String String { get; set; } = default!;
    public string StringId { get; set; } = default!;
    public Panel Panel { get; set; } = default!;
    public string PanelId { get; set; } = default!;
    public int Link { get; set; }
    public int Count { get; set; }
    public string Color { get; set; } = default!;
}