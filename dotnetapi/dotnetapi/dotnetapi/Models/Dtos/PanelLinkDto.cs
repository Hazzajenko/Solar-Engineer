namespace dotnetapi.Models.Dtos;

public class PanelLinkDto
{
    public string Id { get; set; } = default!;
    public int ProjectId { get; set; } = default!;
    public string StringId { get; set; } = default!;
    public string PositiveToId { get; set; } = default!;
    public string NegativeToId { get; set; } = default!;
}
