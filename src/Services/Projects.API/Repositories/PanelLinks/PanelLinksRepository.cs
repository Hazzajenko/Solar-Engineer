using Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;
using Projects.API.Contracts.Data;
using Projects.API.Data;
using Projects.API.Entities;
using Projects.API.Mapping;

namespace Projects.API.Repositories.PanelLinks;

public sealed class PanelLinksRepository
    : GenericRepository<ProjectsContext, PanelLink>,
        IPanelLinksRepository
{
    public PanelLinksRepository(ProjectsContext context)
        : base(context)
    {
    }

    public async Task<IEnumerable<PanelLinkDto>> GetPanelLinksByProjectIdAsync(Guid projectId)
    {
        return await Queryable
            .Where(x => x.ProjectId == projectId)
            .Select(x => x.ToDto())
            .ToListAsync();
    }
}