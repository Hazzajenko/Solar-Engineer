using dotnetapi.Models.Dtos.Projects;

namespace dotnetapi.Contracts.Responses;

public class OnePanelLinkResponse
{
    public PanelLinkDto Link { get; set; } = default!;
}

public class ManyPanelLinksResponse
{
    public IEnumerable<PanelLinkDto> Links { get; init; } = Enumerable.Empty<PanelLinkDto>();
}

public class OnePanelLinkDeleteResponse
{
    public string LinkId { get; set; } = default!;
}