using Infrastructure.Common;
using Infrastructure.Repositories;
using Projects.Contracts.Data;
using Projects.Domain.Entities;

namespace Projects.Application.Repositories.Panels;

public interface IPanelsRepository : IGenericRepository<Panel>
{
    Task<IEnumerable<PanelDto>> GetPanelsByProjectIdAsync(Guid projectId);
    Task<Panel?> GetPanelByIdAndProjectIdAsync(Guid id, Guid projectId);
    Task<PanelDto?> GetPanelByLocationAsync(Guid id, Guid projectId, Panel.Point location);

    Task<IEnumerable<Panel>> GetManyPanelsAsync(Guid projectId, IEnumerable<Guid> panelIds);

    // Task<bool> ArePanelLocationsUniqueAsync(Guid projectId, IEnumerable<Panel.Point> locations);
    Task<bool> DeletePanelByIdAndProjectIdAsync(Guid id, Guid projectId);
    Task<bool> DeleteManyPanelsAsync(Guid projectId, IEnumerable<Guid> panelIds);

    Task<TPanelResponse> CreatePanelAndSaveChangesAsync<TPanelResponse>(Panel panel)
        where TPanelResponse : IMappable<Panel>;
}