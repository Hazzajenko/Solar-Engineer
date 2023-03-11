using Infrastructure.Common;
using Infrastructure.Repositories;
using Projects.API.Contracts.Data;
using Projects.API.Entities;

namespace Projects.API.Repositories.Panels;

public interface IPanelsRepository : IGenericRepository<Panel>
{
    Task<IEnumerable<PanelDto>> GetPanelsByProjectIdAsync(Guid projectId);
    Task<Panel?> GetPanelByIdAndProjectIdAsync(Guid id, Guid projectId);
    Task<PanelDto?> GetPanelByLocationAsync(Guid id, Guid projectId, string location);
    Task<bool> ArePanelLocationsUniqueAsync(Guid projectId, IEnumerable<string> locations);

    Task<TPanelResponse> CreatePanelAsync<TPanelResponse>(Panel panel)
        where TPanelResponse : IMappable<Panel>;
}