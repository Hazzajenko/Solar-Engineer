using Infrastructure.Repositories;
using Projects.API.Contracts.Data;
using Projects.API.Entities;

namespace Projects.API.Repositories.PanelLinks;

public interface IPanelLinksRepository : IGenericRepository<PanelLink>
{
    Task<IEnumerable<PanelLinkDto>> GetPanelLinksByProjectIdAsync(Guid projectId);
}