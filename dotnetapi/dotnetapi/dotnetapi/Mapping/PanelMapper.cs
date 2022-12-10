using dotnetapi.Contracts.Requests;
using dotnetapi.Models.Dtos;
using dotnetapi.Models.Entities;

namespace dotnetapi.Mapping;

public static class PanelMapper
{
    public static Panel ToEntity(this CreatePanelRequest request, AppUser user)
    {
        return new Panel
        {
            Id = request.Id,
            Name = request.Name,
            Location = request.Location,
            Rotation = request.Rotation,
            CreatedAt = DateTime.Now,
            CreatedBy = user,
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


    public static Panel AddData(this Panel request, Panel? data)
    {
        request.Length = data.Length;
        request.Weight = data.Weight;
        request.Width = data.Width;
        request.MaximumPower = data.MaximumPower;
        request.MaximumPowerTemp = data.MaximumPowerTemp;
        request.OpenCircuitVoltage = data.OpenCircuitVoltage;
        request.ShortCircuitCurrent = data.ShortCircuitCurrent;
        request.CurrentAtMaximumPower = data.CurrentAtMaximumPower;
        request.OpenCircuitVoltageTemp = data.OpenCircuitVoltageTemp;
        request.ShortCircuitCurrentTemp = data.ShortCircuitCurrentTemp;
        request.VoltageAtMaximumPower = data.VoltageAtMaximumPower;
        return request;
    }

    public static Panel ToEntity(this PanelDto request)
    {
        return new Panel
        {
            Name = request.Name,
            Location = request.Location,
            Rotation = request.Rotation,
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


    public static PanelDto ToDto(this Panel request)
    {
        return new PanelDto
        {
            Id = request.Id,
            ProjectId = request.Project.Id,
            StringId = request.String.Id,
            Location = request.Location,
            Rotation = request.Rotation,
            Name = request.Name,
            Model = UnitModelDto.Panel,
            CreatedAt = request.CreatedAt,
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