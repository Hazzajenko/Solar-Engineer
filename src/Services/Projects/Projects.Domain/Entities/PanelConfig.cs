using Infrastructure.Common;
using Projects.Domain.Common;

namespace Projects.Domain.Entities;

public class PanelConfig : IEntity, IProject
{
    public string? Brand { get; set; }
    public string Name { get; set; } = default!;
    public string FullName => Brand is null ? Name : $"{Brand} {Name}";
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
    public bool Default { get; set; }
    public ICollection<Panel> Panels { get; set; } = default!;
    public Guid? CreatedById { get; set; }
    public Guid Id { get; set; }
    public DateTime CreatedTime { get; set; } = DateTime.UtcNow;
    public DateTime LastModifiedTime { get; set; } = DateTime.UtcNow;
}