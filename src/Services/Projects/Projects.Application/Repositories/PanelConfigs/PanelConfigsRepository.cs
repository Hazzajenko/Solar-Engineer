using Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;
using Projects.Application.Data;
using Projects.Domain.Entities;

namespace Projects.Application.Repositories.PanelConfigs;

public sealed class PanelConfigsRepository
    : GenericRepository<ProjectsContext, PanelConfig>,
        IPanelConfigsRepository
{
    public PanelConfigsRepository(ProjectsContext context)
        : base(context)
    {
    }

    public async Task<PanelConfig> GetByIdNotNullAsync(Guid id)
    {
        return await Queryable.ThrowHubExceptionIfNullSingleOrDefaultAsync(
            x => x.Id == id,
            "PanelConfig does not exist"
        );
    }

    public async Task<PanelConfig> GetDefaultPanelConfigAsync()
    {
        return await Queryable.Where(x => x.Default).Take(1).SingleOrDefaultAsync()
               ?? throw new ArgumentNullException(nameof(PanelConfig));
    }
}