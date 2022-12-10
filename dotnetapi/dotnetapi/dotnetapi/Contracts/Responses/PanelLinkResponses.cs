using dotnetapi.Models.Dtos;

namespace dotnetapi.Contracts.Responses;

public class OnePanelLinkResponse
{
    public PanelLinkDto PanelLink { get; set; } = default!;
}

public class ManyPanelLinksResponse
{
    public IEnumerable<PanelLinkDto> PanelLinks { get; init; } = Enumerable.Empty<PanelLinkDto>();
}

public class OnePanelLinkDeleteResponse
{
    public string PanelLinkId { get; set; } = default!;
}
