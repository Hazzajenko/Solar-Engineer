using Projects.Contracts.Data;
using Projects.Domain.Entities;

namespace Projects.Application.Mapping;

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
            NegativePanelId = panelLink.NegativePanelId.ToString(),
            PositivePanelId = panelLink.PositivePanelId.ToString()
        };
    }

    public static IEnumerable<PanelLinkDto> ToDtoList(this PanelLink panelLink)
    {
        return new List<PanelLinkDto> { panelLink.ToDto() };
    }
}