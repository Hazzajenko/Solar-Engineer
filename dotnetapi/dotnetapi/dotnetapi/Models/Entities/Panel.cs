namespace dotnetapi.Models.Entities;

public class Panel : ProjectBaseEntity {
    public DateTime CreatedAt { get; set; }
    public AppUser CreatedBy { get; set; } = default!;
    public String String { get; set; } = default!;
    public string StringId { get; set; } = default!;
    public PanelLink PositiveTo { get; set; } = default!;
    public PanelLink NegativeTo { get; set; } = default!;
    public string PositiveToId { get; set; } = default!;
    public string NegativeToId { get; set; } = default!;
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
}
