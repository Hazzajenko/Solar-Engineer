using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace dotnetapi.Contracts.Requests;

public class DataWrapper<T>
{
    public T Data { get; set; } = default!;
}

public class CreatePanelRequest
{
    [Required] public string Id { get; init; } = default!;
    [Required] public string StringId { get; init; } = default!;
    [Required] public string Name { get; init; } = default!;
    [Required] public string Location { get; init; } = default!;
    [Required] public int Rotation { get; init; }

    [DefaultValue(13.19)] public double CurrentAtMaximumPower { get; set; }

    [DefaultValue(14.01)] public double ShortCircuitCurrent { get; set; }

    [DefaultValue(0.050)] public double ShortCircuitCurrentTemp { get; set; }

    [DefaultValue(555)] public double MaximumPower { get; set; }

    [DefaultValue(-0.340)] public double MaximumPowerTemp { get; set; }

    [DefaultValue(42.10)] public double VoltageAtMaximumPower { get; set; }

    [DefaultValue(49.95)] public double OpenCircuitVoltage { get; set; }

    [DefaultValue(-0.265)] public double OpenCircuitVoltageTemp { get; set; }

    [DefaultValue(2256)] public double Length { get; set; }

    [DefaultValue(1133)] public double Width { get; set; }

    [DefaultValue(27.2)] public double Weight { get; set; }
}

public class CreateManyPanelsRequest
{
    [Required] public string StringId { get; set; } = default!;
    [Required] public IEnumerable<CreatePanelRequest> Panels { get; init; } = Enumerable.Empty<CreatePanelRequest>();
}

public class UpdatePanelRequestV1
{
    [Required] public string Id { get; init; } = default!;
    public string? StringId { get; set; } = default!;
    public string? Name { get; set; } = default!;
    public string? Location { get; set; } = default!;
    public string? PositiveToId { get; set; } = default!;
    public string? NegativeToId { get; set; } = default!;
    public int? Rotation { get; set; } = default!;
    public bool? IsDisconnectionPoint { get; set; }
    public string? DisconnectionPointPanelLinkId { get; set; }
}

public class UpdateManyPanelsRequestV1
{
    [Required]
    public IEnumerable<UpdatePanelRequestV1> Panels { get; init; } = Enumerable.Empty<UpdatePanelRequestV1>();
}

public class DeleteManyPanelsRequest
{
    [Required] public IEnumerable<string> PanelIds { get; init; } = Enumerable.Empty<string>();
}