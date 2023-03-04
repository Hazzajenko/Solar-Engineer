using Projects.API.Entities;

namespace Projects.API.Data.Seed;

public static class DefaultPanelConfigs
{
    public static IEnumerable<PanelConfig> PanelConfigs =>
        new List<PanelConfig>
        {
            new()
            {
                Brand = "Longi",
                Name = "Himo555m",
                CurrentAtMaximumPower = 13.19,
                ShortCircuitCurrent = 14.01,
                ShortCircuitCurrentTemp = 0.050,
                Length = 2256,
                MaximumPower = 555,
                MaximumPowerTemp = -0.340,
                VoltageAtMaximumPower = 42.10,
                OpenCircuitVoltage = 49.95,
                OpenCircuitVoltageTemp = -0.265,
                Weight = 27.2,
                Width = 1133,
                Default = true,
                Panels = new List<Panel>()
            }
        };
}