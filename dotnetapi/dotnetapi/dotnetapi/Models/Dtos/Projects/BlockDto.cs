namespace dotnetapi.Models.Dtos;

public class BlockDto
{
    public string Id { get; set; } = default!;
    public int ProjectId { get; set; } = default!;
    public string Location { get; set; } = default!;
    public string StringId { get; set; } = default!;
    public BlockTypeDto Type { get; set; } = default!;
}

public enum BlockTypeDto
{
    Undefined,
    Inverter,
    Panel,
    Cable,
    DisconnectionPoint,
    Tray,
    Rail
}