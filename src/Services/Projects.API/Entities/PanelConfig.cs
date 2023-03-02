using Infrastructure.Common;

namespace Projects.API.Entities;

public class PanelConfig : IEntity
{
    public string Brand { get; set; } = "";
    public string Name { get; set; } = default!;
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