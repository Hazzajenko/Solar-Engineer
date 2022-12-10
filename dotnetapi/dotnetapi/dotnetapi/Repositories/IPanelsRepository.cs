using dotnetapi.Contracts.Requests;
using dotnetapi.Models.Entities;

namespace dotnetapi.Repositories;

public interface IPanelsRepository
{
    Task<Panel?> GetPanelByIdAsync(string panelId);
    Task<Panel> CreatePanelAsync(Panel request);

    Task<IEnumerable<Panel>> GetAllPanelsByProjectIdAsync(int projectId);

    Task<bool> UpdatePanelAsync(UpdatePanelRequest request);
    Task<bool> DeletePanelAsync(string panelId);
}