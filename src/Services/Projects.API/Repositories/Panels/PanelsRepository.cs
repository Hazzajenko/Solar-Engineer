using Infrastructure.Common;
using Infrastructure.Repositories;
using Mapster;
using Microsoft.EntityFrameworkCore;
using Projects.API.Contracts.Data;
using Projects.API.Data;
using Projects.API.Entities;

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
            .ProjectToType<PanelDto>()
            // .Select(x => x.ToDto())
            .ToListAsync();
    }

    public async Task<Panel> GetPanelByIdAndProjectIdAsync(Guid id, Guid projectId)
    {
        return await Queryable.ThrowHubExceptionIfNullSingleOrDefaultAsync(
            x => x.Id == id && x.ProjectId == projectId,
            "Panel does not exist"
        );
    }

    public async Task<TPanelResponse> CreatePanelAsync<TPanelResponse>(Panel panel)
        where TPanelResponse : IMappable<Panel>
    {
        await AddAsync(panel);
        await SaveChangesAsync();

        return panel.Adapt<TPanelResponse>();
    }
}