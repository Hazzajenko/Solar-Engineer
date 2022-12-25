namespace dotnetapi.Models.Dtos;

public class PanelDto : BlockDto
{
    public new BlockTypeDto Type { get; set; } = BlockTypeDto.Panel;
    public DateTime CreatedAt { get; set; }
    public AppUserDto CreatedBy { get; set; } = default!;
    public bool IsDisconnectionPoint { get; set; }
    public string? DisconnectionPointPanelLinkId { get; set; } = default!;
    public string? PositiveToId { get; set; } = default!;
    public string? NegativeToId { get; set; } = default!;
    public int Rotation { get; set; }
    public double CurrentAtMaximumPower { get; set; }
    public double ShortCircuitCurrent { get; set; }
    public double ShortCircuitCurrentTemp { get; set; }
    public double Length { get; set; }
    public string Name { get; set; } = default!;
    public double MaximumPower { get; set; }
    public double MaximumPowerTemp { get; set; }
    public double VoltageAtMaximumPower { get; set; }
    public double OpenCircuitVoltage { get; set; }
    public double OpenCircuitVoltageTemp { get; set; }
    public double Weight { get; set; }
    public double Width { get; set; }
}