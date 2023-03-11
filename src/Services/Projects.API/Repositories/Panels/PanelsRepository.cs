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
    // private readonly IMapper _mapper;
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

    public async Task<Panel?> GetPanelByIdAndProjectIdAsync(Guid id, Guid projectId)
    {
        return await Queryable.SingleOrDefaultAsync(x => x.Id == id && x.ProjectId == projectId);
        /*return await Queryable.ThrowHubExceptionIfNullSingleOrDefaultAsync(
            x => x.Id == id && x.ProjectId == projectId,
            "Panel does not exist"
        );*/
    }

    public async Task<PanelDto?> GetPanelByLocationAsync(Guid id, Guid projectId, string location)
    {
        return await Queryable
            .Where(x => x.Id == id && x.ProjectId == projectId && x.Location == location)
            .ProjectToType<PanelDto>()
            .SingleOrDefaultAsync();
    }

    public async Task<bool> ArePanelLocationsUniqueAsync(
        Guid projectId,
        IEnumerable<string> locations
    )
    {
        return await Queryable
            .Where(x => x.ProjectId == projectId && locations.Contains(x.Location))
            .AnyAsync();
    }

    public async Task<TPanelResponse> CreatePanelAsync<TPanelResponse>(Panel panel)
        where TPanelResponse : IMappable<Panel>
    {
        await AddAsync(panel);
        await SaveChangesAsync();

        // _mapper.Map<(Panel, string), TPanelResponse>((panel, "Create"));
        return panel.Adapt<TPanelResponse>();
    }
}