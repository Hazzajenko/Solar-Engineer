using dotnetapi.Models.Dtos;

namespace dotnetapi.Contracts.Responses;

public class OnePanelResponse
{
    public PanelDto Panel { get; set; } = default!;
}

public class ManyPanelsResponse
{
    public IEnumerable<PanelDto> Panels { get; init; } = Enumerable.Empty<PanelDto>();
}