using Infrastructure.Common;
using Projects.API.Data;

namespace Projects.API.Contracts.Data;

public class PanelConfigDto : IEntityDto, IUserObjectDto, IProject
{
    public string Type { get; set; } = EntityType.PanelConfig;
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
    public string Id { get; set; } = default!;
    public DateTime CreatedTime { get; set; }
    public DateTime LastModifiedTime { get; set; }
    public string CreatedById { get; set; } = default!;
}