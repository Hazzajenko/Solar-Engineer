using Projects.API.Contracts.Data;
using Projects.API.Entities;

namespace Projects.API.Mapping;

public static class PanelLinksMapping
{
    public static PanelLinkDto ToDto(this PanelLink panelLink)
    {
        return new PanelLinkDto
        {
            Id = panelLink.Id.ToString(),
            ProjectId = panelLink.ProjectId.ToString(),
            CreatedTime = panelLink.CreatedTime,
            LastModifiedTime = panelLink.LastModifiedTime,
            CreatedById = panelLink.CreatedById.ToString(),
            NegativeToId = panelLink.NegativeToId.ToString(),
            PositiveToId = panelLink.PositiveToId.ToString()
        };
    }

    public static IEnumerable<PanelLinkDto> ToDtoList(this PanelLink panelLink)
    {
        return new List<PanelLinkDto> { panelLink.ToDto() };
    }
}