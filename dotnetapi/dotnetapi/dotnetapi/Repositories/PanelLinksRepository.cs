using dotnetapi.Data;
using dotnetapi.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace dotnetapi.Repositories;

public class PanelLinksRepository : IPanelLinksRepository
{
    private readonly DataContext _context;

    public PanelLinksRepository(DataContext context)
    {
        _context = context;
    }

    public async Task<bool> DeletePanelLinkAsync(string panelLinkId)
    {
        var panelLinkToDelete = await _context.PanelLinks
            .Where(x => x.Id == panelLinkId)
            .SingleOrDefaultAsync();
        if (panelLinkToDelete is null) return false;
        _context.PanelLinks.Remove(panelLinkToDelete);
        await _context.SaveChangesAsync();

        return true;
    }

    public async Task<PanelLink> CreatePanelLinkAsync(PanelLink request)
    {
        await _context.PanelLinks.AddAsync(request);
        await _context.SaveChangesAsync();
        return request;
    }

    public async Task<PanelLink?> GetPanelLinkByIdAsync(string panelLinkId)
    {
        return await _context.PanelLinks
            .Where(x => x.Id == panelLinkId)
            .Include(x => x.Project)
            .Include(x => x.String)
            .Include(x => x.PositiveTo)
            .Include(x => x.NegativeTo)
            .SingleOrDefaultAsync();
    }

    public async Task<IEnumerable<PanelLink>> GetAllPanelLinksByProjectIdAsync(int projectId)
    {
        return await _context.PanelLinks
            .Where(x => x.Project.Id == projectId)
            .Include(x => x.Project)
            .Include(x => x.String)
            .Include(x => x.PositiveTo)
            .Include(x => x.NegativeTo)
            .ToListAsync();
    }
}