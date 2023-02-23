using Infrastructure.Common;

namespace Projects.API.Entities;

public class Panel : IEntity
{
    public DateTime CreatedAt { get; set; }
    // public AppUser CreatedBy { get; set; } = default!;
    public String String { get; set; } = default!;
    public string StringId { get; set; } = default!;
    public bool IsDisconnectionPoint { get; set; } = false;
    public string? DisconnectionPointPanelLinkId { get; set; }
    /*public PanelLink? PositiveTo { get; set; }
    public PanelLink? NegativeTo { get; set; }*/
    public string? PositiveToId { get; set; }
    public string? NegativeToId { get; set; }
    public string Name { get; set; } = default!;
    public string Location { get; set; } = default!;
    public int Rotation { get; set; }
    public double CurrentAtMaximumPower { get; set; }
    public double ShortCircuitCurrent { get; set; }
    public double ShortCircuitCurrentTemp { get; set; }
    public double Length { get; set; }
    public double MaximumPower { get; set; }
    public double MaximumPowerTemp { get; set; }
    public double VoltageAtMaximumPower { get; set; }
    public double OpenCircuitVoltage { get; set; }
    public double OpenCircuitVoltageTemp { get; set; }
    public double Weight { get; set; }
    public double Width { get; set; }
    public Guid Id { get; set; }
    public DateTime CreatedTime { get; set; }
    public DateTime LastModifiedTime { get; set; }
}
