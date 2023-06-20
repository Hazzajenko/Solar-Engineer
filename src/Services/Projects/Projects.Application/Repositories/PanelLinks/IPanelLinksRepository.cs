using Infrastructure.Repositories;
using Projects.Contracts.Data;
using Projects.Domain.Entities;

namespace Projects.Application.Repositories.PanelLinks;

public interface IPanelLinksRepository : IGenericRepository<PanelLink>
{
    Task<IEnumerable<PanelLinkDto>> GetPanelLinksByProjectIdAsync(Guid projectId);
    Task<IEnumerable<PanelLink>> GetManyPanelLinksByProjectIdAndIdsAsync(
        Guid projectId,
        IEnumerable<Guid> ids
    );

    Task<bool> DeletePanelLinkByProjectIdAndIdAsync(Guid projectId, Guid id);
}
