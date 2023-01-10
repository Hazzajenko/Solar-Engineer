namespace dotnetapi.Models.Dtos.Projects;

public class PathDto : EntityDto
{
    public new EntityTypeDto Type { get; set; } = EntityTypeDto.Path;
    public string StringId { get; init; } = default!;
    public string PanelId { get; init; } = default!;
    public int Link { get; init; }
    public int Count { get; init; }
    public string Color { get; init; } = default!;
}