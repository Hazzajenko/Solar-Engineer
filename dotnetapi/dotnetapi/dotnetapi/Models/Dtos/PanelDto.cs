namespace dotnetapi.Models.Dtos;

public class PanelDto
{
    public string Id { get; set; } = default!;
    public int ProjectId { get; set; } = default!;
    public string StringId { get; set; } = default!;
    public DateTime CreatedAt { get; set; }
    public AppUserDto CreatedBy { get; set; } = default!;
    public UnitModelDto Model { get; set; } = UnitModelDto.Panel;
    public string PositiveToId { get; set; } = default!;
    public string NegativeToId { get; set; } = default!;
    public string Location { get; set; } = default!;
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