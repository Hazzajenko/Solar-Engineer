using dotnetapi.Contracts.Requests.Panels;
using dotnetapi.Models.Entities;

namespace dotnetapi.Repositories.Panels;

public interface IPanelsRepository
{
    Task<Panel?> GetPanelByIdAsync(string panelId);
    Task<Panel> CreatePanelAsync(Panel request);

    Task<IEnumerable<Panel>> GetAllPanelsByProjectIdAsync(int projectId);

    Task<bool> UpdatePanelAsync(UpdatePanelRequest request);
    Task<bool> DeletePanelAsync(string panelId);
}