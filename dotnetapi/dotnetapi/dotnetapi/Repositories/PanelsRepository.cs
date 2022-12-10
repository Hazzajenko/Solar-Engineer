using dotnetapi.Contracts.Requests;
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

        if (request.Location is not null)
            panelToUpdate.Location = request.Location;

        if (request.Rotation is not null)
            panelToUpdate.Rotation = (int)request.Rotation;

        if (request.StringId is not null)
        {
            var newString = await _context.Strings
                .Where(x => x.Id == request.StringId)
                .SingleOrDefaultAsync();
            if (newString is null) return false;


            panelToUpdate.String = newString;
        }

        if (request.PositiveToId is not null)
        {
            var newPositiveLink = await _context.PanelLinks
                .Where(x => x.Id == request.PositiveToId)
                .SingleOrDefaultAsync();
            if (newPositiveLink is null) return false;


            panelToUpdate.PositiveTo = newPositiveLink;
        }

        if (request.NegativeToId is not null)
        {
            var newNegativeLink = await _context.PanelLinks
                .Where(x => x.Id == request.NegativeToId)
                .SingleOrDefaultAsync();
            if (newNegativeLink is null) return false;


            panelToUpdate.NegativeTo = newNegativeLink;
        }
        /*if (request.Rotation is not null)
        {
            panelToUpdate.Rotation = request.Rotation;
        }*/

        // request.Rotation != null ? panelToUpdate.Rotation = (int)request.Rotation : 

        /*panelToUpdate.String = request.StringId;
        panelToUpdate.PositiveTo = request.PositiveToId;
        panelToUpdate.NegativeTo = request.NegativeToId;
        panelToUpdate.Rotation = request.Rotation;
        panelToUpdate.NegativeTo = request.NegativeTo;*/
        var save = await _context.SaveChangesAsync();
        return save > 0;
    }

    public async Task<bool> DeletePanelAsync(string panelId)
    {
        var panelToDelete = await _context.Panels
            .Where(x => x.Id == panelId)
            .SingleOrDefaultAsync();
        if (panelToDelete is null) return false;
        _context.Panels.Remove(panelToDelete);
        await _context.SaveChangesAsync();

        return true;
    }
}