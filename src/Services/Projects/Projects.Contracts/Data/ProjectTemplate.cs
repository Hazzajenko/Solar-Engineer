using Projects.Domain.Entities;

namespace Projects.Contracts.Data;

public class ProjectTemplate
{
    public IEnumerable<PanelTemplateItem> Panels { get; set; } = default!;
    public IEnumerable<StringTemplateItem> Strings { get; set; } = default!;
    public IEnumerable<PanelLinkTemplateItem> PanelLinks { get; set; } = default!;
    public IEnumerable<PanelConfigTemplateItem> PanelConfigs { get; set; } = default!;
}

public class PanelTemplateItem
{
    public string Id { get; set; } = default!;
    public string Type { get; set; } = EntityType.Panel;
    public string StringId { get; set; } = default!;
    public string PanelConfigId { get; set; } = default!;
    public Panel.Point Location { get; set; } = default!;
    public double Angle { get; set; }
}

public class StringTemplateItem
{
    public string Id { get; set; } = default!;
    public string Type { get; set; } = EntityType.String;
    public string Name { get; set; } = default!;
    public string Colour { get; set; } = default!;
    public bool Parallel { get; set; }
}

public class PanelLinkTemplateItem
{
    public string Id { get; set; } = default!;
    public string Type { get; set; } = EntityType.PanelLink;
    public string StringId { get; set; } = default!;
    public string PositivePanelId { get; set; } = default!;
    public string NegativePanelId { get; set; } = default!;
    public IEnumerable<PanelLink.LinePoint> LinePoints { get; set; } = default!;
}

public class PanelConfigTemplateItem
{
    public string Type { get; set; } = EntityType.PanelConfig;
    public string? Brand { get; set; }
    public string Name { get; set; } = default!;
    public string FullName { get; set; } = default!;
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
}
