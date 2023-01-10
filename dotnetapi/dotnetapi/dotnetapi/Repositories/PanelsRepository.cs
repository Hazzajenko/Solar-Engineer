using dotnetapi.Contracts.Requests.Panels;
using dotnetapi.Data;
using dotnetapi.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace dotnetapi.Repositories;

public class PanelsRepository : IPanelsRepository
{
    private readonly DataContext _context;

    public PanelsRepository(DataContext context)
    {
        _context = context;
    }

    public async Task<Panel?> GetPanelByIdAsync(string panelId)
    {
        return await _context.Panels
            .Where(x => x.Id == panelId)
            .Include(x => x.Project)
            .Include(x => x.String)
            .SingleOrDefaultAsync();
    }

    public async Task<Panel> CreatePanelAsync(Panel request)
    {
        await _context.Panels.AddAsync(request);
        await _context.SaveChangesAsync();
        return request;
    }

    public async Task<IEnumerable<Panel>> GetAllPanelsByProjectIdAsync(int projectId)
    {
        return await _context.Panels
            .Where(x => x.Project.Id == projectId)
            .Include(x => x.Project)
            .Include(x => x.String)
            .ToListAsync();
    }

    public async Task<bool> UpdatePanelAsync(UpdatePanelRequest request)
    {
        var panelToUpdate = await _context.Panels
            .Where(x => x.Id == request.Id)
            .SingleOrDefaultAsync();

        if (panelToUpdate is null) return false;

        if (request.Changes.Location is not null)
            panelToUpdate.Location = request.Changes.Location;

        if (request.Changes.Rotation is not null)
            panelToUpdate.Rotation = (int)request.Changes.Rotation;

        if (request.Changes.StringId is not null)
        {
            var newString = await _context.Strings
                .Where(x => x.Id == request.Changes.StringId)
                .SingleOrDefaultAsync();
            if (newString is null) return false;


            panelToUpdate.String = newString;
        }


        if (request.Changes.IsDisconnectionPoint is not null)
            panelToUpdate.IsDisconnectionPoint = (bool)request.Changes.IsDisconnectionPoint;

        var save = await _context.SaveChangesAsync();
        return save > 0;
    }

    public async Task<bool> DeletePanelAsync(string panelId)
    {
        /*var panelToDelete = await _context.Panels
            .Where(x => x.Id == panelId)
            .SingleOrDefaultAsync();
        if (panelToDelete is null) return false;
        _context.Panels.Remove(panelToDelete);
        await _context.SaveChangesAsync();*/
        var panelToDelete = await _context.Panels
            .Where(x => x.Id == panelId)
            .ExecuteDeleteAsync();
        return panelToDelete > 0;
    }
}