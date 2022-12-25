namespace dotnetapi.Models.Dtos.Projects;

public class PanelLinkDto : EntityDto
{
    public new EntityTypeDto Type { get; set; } = EntityTypeDto.Link;
    public string StringId { get; set; } = default!;
    public string PositiveToId { get; set; } = default!;
    public string NegativeToId { get; set; } = default!;
    public bool IsDisconnectionPoint { get; set; }
    public string? DisconnectionPointPanelId { get; set; }
}