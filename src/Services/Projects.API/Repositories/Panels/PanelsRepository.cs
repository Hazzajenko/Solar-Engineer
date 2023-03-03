using Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;
using Projects.API.Contracts.Data;
using Projects.API.Data;
using Projects.API.Entities;
using Projects.API.Mapping;

namespace Projects.API.Repositories.Panels;

public sealed class PanelsRepository : GenericRepository<ProjectsContext, Panel>, IPanelsRepository
{
    public PanelsRepository(ProjectsContext context)
        : base(context)
    {
    }

    public async Task<IEnumerable<PanelDto>> GetPanelsByProjectIdAsync(Guid projectId)
    {
        return await Queryable
            .Where(x => x.ProjectId == projectId)
            .Select(x => x.ToDto())
            .ToListAsync();
    }
}