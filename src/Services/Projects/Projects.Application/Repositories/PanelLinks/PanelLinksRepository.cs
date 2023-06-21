using Infrastructure.Repositories;
using Mapster;
using Microsoft.EntityFrameworkCore;
using Projects.Application.Data;
using Projects.Application.Mapping;
using Projects.Contracts.Data;
using Projects.Domain.Entities;

namespace Projects.Application.Repositories.PanelLinks;

public sealed class PanelLinksRepository
    : GenericRepository<ProjectsContext, PanelLink>,
        IPanelLinksRepository
{
    public PanelLinksRepository(ProjectsContext context)
        : base(context) { }

    public async Task<IEnumerable<PanelLinkDto>> GetPanelLinksByProjectIdAsync(Guid projectId)
    {
        return await Queryable
            .Where(x => x.ProjectId == projectId)
            .ProjectToType<PanelLinkDto>()
            // .Select(x => x.ToDto())
            .ToListAsync();
    }

    public async Task<IEnumerable<PanelLink>> GetManyPanelLinksByProjectIdAndIdsAsync(
        Guid projectId,
        IEnumerable<Guid> ids
    )
    {
        return await Queryable
            .Where(x => x.ProjectId == projectId && ids.Contains(x.Id))
            .ToListAsync();
    }

    public async Task<bool> DeletePanelLinkByProjectIdAndIdAsync(Guid projectId, Guid id)
    {
        // Delete
        var panelLink = await Queryable.FirstOrDefaultAsync(
            x => x.ProjectId == projectId && x.Id == id
        );
        if (panelLink is null)
            return false;
        await DeleteAsync(panelLink);
        return true;
    }
}
