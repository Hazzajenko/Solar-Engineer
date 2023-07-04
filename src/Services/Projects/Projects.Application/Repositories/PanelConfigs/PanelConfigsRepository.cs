using Infrastructure.Repositories;
using Mapster;
using Microsoft.EntityFrameworkCore;
using Projects.Application.Data;
using Projects.Application.Mapping;
using Projects.Contracts.Data;
using Projects.Domain.Entities;

namespace Projects.Application.Repositories.PanelConfigs;

public sealed class PanelConfigsRepository
    : GenericRepository<ProjectsContext, PanelConfig>,
        IPanelConfigsRepository
{
    public PanelConfigsRepository(ProjectsContext context)
        : base(context) { }

    /*public async Task<PanelConfig> GetByIdNotNullAsync(Guid id)
    {
        return await Queryable.ThrowHubExceptionIfNullSingleOrDefaultAsync(
            x => x.Id == id,
            "PanelConfig does not exist"
        );
    }*/

    public async Task<IEnumerable<PanelConfig>> GetDefaultPanelConfigsAsync()
    {
        return await Queryable.Where(x => x.Default).ToListAsync();
    }

    public async Task<IEnumerable<PanelConfigDto>> GetDefaultPanelConfigDtosAsync()
    {
        return await Queryable.Where(x => x.Default).ProjectToType<PanelConfigDto>().ToListAsync();
    }

    public async Task<PanelConfig> GetByFullNameAsync(string fullname)
    {
        return await Queryable.SingleOrDefaultAsync(x => x.FullName == fullname)
            ?? throw new ArgumentNullException(nameof(PanelConfig));
    }

    public async Task<PanelConfig> GetByBrandAndModelAsync(string brand, string model)
    {
        return await Queryable.SingleOrDefaultAsync(x => x.Brand == brand && x.Name == model)
            ?? throw new ArgumentNullException(nameof(PanelConfig));
    }

    public async Task<IEnumerable<PanelConfigDto>> GetByPanelConfigIdsAsync(
        IEnumerable<Guid> panelConfigIds
    )
    {
        return await Queryable
            .Where(x => panelConfigIds.Contains(x.Id))
            .Select(x => x.ToDto())
            .ToListAsync();
    }
}
