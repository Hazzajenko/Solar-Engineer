using Infrastructure.Repositories;
using Projects.API.Entities;

namespace Projects.API.Repositories.PanelConfigs;

public interface IPanelConfigsRepository : IGenericRepository<PanelConfig>
{
    Task<PanelConfig> GetDefaultPanelConfigAsync();
    Task<PanelConfig> GetByIdNotNullAsync(Guid id);
}