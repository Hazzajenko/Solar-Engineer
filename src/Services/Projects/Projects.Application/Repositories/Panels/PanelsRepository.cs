using System.Linq.Expressions;
using Infrastructure.Common;
using Infrastructure.Logging;
using Infrastructure.Repositories;
using Mapster;
using Microsoft.EntityFrameworkCore;
using Projects.Application.Data;
using Projects.Domain.Contracts.Data;
using Projects.Domain.Entities;

namespace Projects.Application.Repositories.Panels;

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

    public async Task<PanelDto?> GetPanelByLocationAsync(Guid id, Guid projectId, Panel.Point location)
    {
        return await Queryable
            .Where(x => x.Id == id && x.ProjectId == projectId && x.Location == location)
            .ProjectToType<PanelDto>()
            .SingleOrDefaultAsync();
    }

    public async Task<IEnumerable<Panel>> GetManyPanelsAsync(
        Guid projectId,
        IEnumerable<Guid> panelIds
    )
    {
        return await Queryable
            .Where(x => x.ProjectId == projectId && panelIds.Contains(x.Id))
            .ToListAsync();
    }

    /*public async Task<bool> ArePanelLocationsUniqueAsync(
        Guid projectId,
        IEnumerable<Panel.Point> locations
    )
    {
        return await Queryable
            .Where(x => x.ProjectId == projectId && locations.Contains(x.Location))
            .AnyAsync();
    }*/

    public async Task<TPanelResponse> CreatePanelAsync<TPanelResponse>(Panel panel)
        where TPanelResponse : IMappable<Panel>
    {
        await AddAsync(panel);
        await SaveChangesAsync();

        // _mapper.Map<(Panel, string), TPanelResponse>((panel, "Create"));
        return panel.Adapt<TPanelResponse>();
    }

    public async Task<bool> DeletePanelByIdAndProjectIdAsync(Guid id, Guid projectId)
    {
        Expression<Func<Panel, bool>> where = x => x.Id == id && x.ProjectId == projectId;
        var panel = await Queryable.SingleOrDefaultAsync(
            where
            // x => x.Id == id && x.ProjectId == projectId
        );
        if (panel is null)
            return false;
        var keys = GetKeys(panel);
        if (keys.Any())
            keys.DumpObjectJson();

        await Queryable.Where(where).ExecuteDeleteAsync();

        // await FindManyAndDeleteAsync(where);

        // await DeleteAsync(new { id, projectId });
        // await DeleteAsync(where);
        // await DeleteAsync(x => x.Id == id && x.ProjectId == projectId);
        // await DeleteAsync(panel.Id);
        await SaveChangesAsync();

        return true;
    }

    public async Task<bool> DeleteManyPanelsAsync(Guid projectId, IEnumerable<Guid> panelIds)
    {
        /*Expression<Func<Panel, bool>> where = x =>
            x.ProjectId == projectId && panelIds.Contains(x.Id);
        var panels = await Queryable
            .Where(
                where
                // x => x.Id == id && x.ProjectId == projectId
            )
            .ToListAsync();
        if (panels.Any() is false)
            return false;
        if (panels.Count() != panelIds.Count())
            throw new HubException("Some panels do not exist");*/

        await Queryable
            .Where(x => x.ProjectId == projectId && panelIds.Contains(x.Id))
            .ExecuteDeleteAsync();

        await SaveChangesAsync();

        return true;
    }
}