using Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;
using Projects.API.Data;
using Projects.API.Entities;

namespace Projects.API.Repositories.PanelConfigs;

public sealed class PanelConfigsRepository
    : GenericRepository<ProjectsContext, PanelConfig>,
        IPanelConfigsRepository
{
    public PanelConfigsRepository(ProjectsContext context)
        : base(context)
    {
    }

    public async Task<PanelConfig> GetDefaultPanelConfigAsync()
    {
        return await Queryable
            .Where(x => x.Default)
            .Take(1)
            .SingleOrDefaultAsync() ?? throw new ArgumentNullException(nameof(PanelConfig));
    }
}