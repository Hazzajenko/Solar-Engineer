using dotnetapi.Models.Dtos;
using dotnetapi.Models.Entities;

namespace dotnetapi.Services;

public interface ILinksService
{
    Task<PanelLinkDto> CreatePanelLinkAsync(PanelLink request);
    Task<PanelLinkDto?> GetPanelLinkByIdAsync(string panelLinkId);
    Task<IEnumerable<PanelLinkDto>> GetAllPanelLinksByProjectIdAsync(int projectId);
    Task<bool> DeletePanelLinkAsync(string panelLinkId);
}