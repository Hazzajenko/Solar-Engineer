using dotnetapi.Contracts.Requests;
using dotnetapi.Models.Dtos.Projects;
using dotnetapi.Models.Entities;

namespace dotnetapi.Services;

public interface IPanelsService
{
    Task<PanelDto> CreatePanelAsync(Panel request, int projectId, string requestStringId);
    Task<int> CreateManyPanelsAsync(IEnumerable<Panel> request, int projectId, string requestStringId);
    Task<PanelDto?> GetPanelByIdAsync(string id);

    Task<IEnumerable<PanelDto>> GetAllPanelsByProjectIdAsync(int projectId);

    Task<bool> UpdatePanelAsync(UpdatePanelRequest request);
    Task<bool[]> UpdateManyPanelsAsync(UpdateManyPanelsRequest request);
    Task<bool> DeletePanelAsync(string stringId);
    Task<bool[]> DeleteManyPanelsAsync(DeleteManyPanelsRequest request);
}