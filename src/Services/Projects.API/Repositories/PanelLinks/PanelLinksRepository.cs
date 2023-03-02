using Infrastructure.Repositories;
using Projects.API.Data;
using Projects.API.Entities;

namespace Projects.API.Repositories.PanelLinks;

public sealed class PanelLinksRepository
    : GenericRepository<ProjectsContext, PanelLink>,
        IPanelLinksRepository
{
    public PanelLinksRepository(ProjectsContext context)
        : base(context)
    {
    }
}