using Infrastructure.Repositories;
using Projects.API.Data;
using Projects.API.Entities;

namespace Projects.API.Repositories.Panels;

public sealed class PanelsRepository : GenericRepository<ProjectsContext, Panel>, IPanelsRepository
{
    public PanelsRepository(ProjectsContext context)
        : base(context)
    {
    }
}