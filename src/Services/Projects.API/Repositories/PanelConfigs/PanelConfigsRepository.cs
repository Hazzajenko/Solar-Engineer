using Infrastructure.Repositories;
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
}