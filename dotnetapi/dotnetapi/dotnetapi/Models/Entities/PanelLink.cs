namespace dotnetapi.Models.Entities;

public class PanelLink : ProjectBaseEntity
{
    public String String { get; set; } = default!;
    public string StringId { get; set; } = default!;
    public Panel PositiveTo { get; set; } = default!;
    public Panel NegativeTo { get; set; } = default!;
    public string PositiveToId { get; set; } = default!;
    public string NegativeToId { get; set; } = default!;
}