using dotnetapi.Models.Dtos;
using dotnetapi.Models.Entities;

namespace dotnetapi.Mapping;

public static class PanelMapper
{
    /*public static Panel ToEntity(this CreatePanelRequest request) {
        return new Panel {
            Name = request.Name,
            CreatedAt = DateTime.Now,
            Length = request.Length,
            Weight = request.Weight,
            Width = request.Width,
            MaximumPower = request.MaximumPower,
            MaximumPowerTemp = request.MaximumPowerTemp,
            OpenCircuitVoltage = request.OpenCircuitVoltage,
            ShortCircuitCurrent = request.ShortCircuitCurrent,
            CurrentAtMaximumPower = request.CurrentAtMaximumPower,
            OpenCircuitVoltageTemp = request.OpenCircuitVoltageTemp,
            ShortCircuitCurrentTemp = request.ShortCircuitCurrentTemp,
            VoltageAtMaximumPower = request.VoltageAtMaximumPower
        };
    }*/

    public static PanelDto ToDto(this Panel request)
    {
        return new PanelDto
        {
            Name = request.Name,
            CreatedAt = DateTime.Now,
            Length = request.Length,
            Weight = request.Weight,
            Width = request.Width,
            MaximumPower = request.MaximumPower,
            MaximumPowerTemp = request.MaximumPowerTemp,
            OpenCircuitVoltage = request.OpenCircuitVoltage,
            ShortCircuitCurrent = request.ShortCircuitCurrent,
            CurrentAtMaximumPower = request.CurrentAtMaximumPower,
            OpenCircuitVoltageTemp = request.OpenCircuitVoltageTemp,
            ShortCircuitCurrentTemp = request.ShortCircuitCurrentTemp,
            VoltageAtMaximumPower = request.VoltageAtMaximumPower
        };
    }
}