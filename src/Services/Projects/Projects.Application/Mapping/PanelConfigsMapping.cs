using Projects.Domain.Contracts.Data;
using Projects.Domain.Entities;

namespace Projects.Application.Mapping;

public static class PanelConfigsMapping
{
    public static PanelConfigDto ToDto(this PanelConfig panelConfig)
    {
        return new PanelConfigDto
        {
            Brand = panelConfig.Brand,
            Name = panelConfig.Name,
            FullName = panelConfig.FullName,
            CurrentAtMaximumPower = panelConfig.CurrentAtMaximumPower,
            ShortCircuitCurrent = panelConfig.ShortCircuitCurrent,
            ShortCircuitCurrentTemp = panelConfig.ShortCircuitCurrentTemp,
            Length = panelConfig.Length,
            MaximumPower = panelConfig.MaximumPower,
            MaximumPowerTemp = panelConfig.MaximumPowerTemp,
            VoltageAtMaximumPower = panelConfig.VoltageAtMaximumPower,
            OpenCircuitVoltage = panelConfig.OpenCircuitVoltage,
            OpenCircuitVoltageTemp = panelConfig.OpenCircuitVoltageTemp,
            Weight = panelConfig.Weight,
            Width = panelConfig.Width,
            Default = panelConfig.Default,
            Id = panelConfig.Id.ToString(),
            CreatedTime = panelConfig.CreatedTime,
            LastModifiedTime = panelConfig.LastModifiedTime,
            CreatedById = panelConfig.CreatedById.ToString()
        };
    }

    public static IEnumerable<PanelConfigDto> ToDtoList(this PanelConfig panelConfig)
    {
        return new List<PanelConfigDto> { panelConfig.ToDto() };
    }
}