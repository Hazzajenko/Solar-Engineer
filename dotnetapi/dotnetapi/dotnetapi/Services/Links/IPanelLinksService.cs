using dotnetapi.Models.Dtos.Projects;
using dotnetapi.Models.Entities;

namespace dotnetapi.Services.Links;

public interface IPanelLinksService
{
    Task<PanelLinkDto> CreatePanelLinkAsync(PanelLink request);
    Task<PanelLinkDto?> GetPanelLinkByIdAsync(string panelLinkId);
    Task<IEnumerable<PanelLinkDto>> GetAllPanelLinksByProjectIdAsync(int projectId);
    Task<bool> DeletePanelLinkAsync(string panelLinkId);
}