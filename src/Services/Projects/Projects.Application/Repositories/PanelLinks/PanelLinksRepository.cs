using Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;
using Projects.Application.Data;
using Projects.Application.Mapping;
using Projects.Domain.Contracts.Data;
using Projects.Domain.Entities;

namespace Projects.Application.Repositories.PanelLinks;

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