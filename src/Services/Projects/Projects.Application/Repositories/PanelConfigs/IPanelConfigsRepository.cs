using Infrastructure.Repositories;
using Projects.Contracts.Data;
using Projects.Domain.Entities;

namespace Projects.Application.Repositories.PanelConfigs;

public interface IPanelConfigsRepository : IGenericRepository<PanelConfig>
{
    Task<IEnumerable<PanelConfig>> GetDefaultPanelConfigsAsync();

    // Task<PanelConfig> GetByIdNotNullAsync(Guid id);
    Task<PanelConfig> GetByFullNameAsync(string fullname);

    Task<PanelConfig> GetByBrandAndModelAsync(string brand, string model);
    Task<IEnumerable<PanelConfigDto>> GetByPanelConfigIdsAsync(IEnumerable<Guid> panelConfigIds);
}
