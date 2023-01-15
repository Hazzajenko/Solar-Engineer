using dotnetapi.Contracts.Requests;
using dotnetapi.Data;
using Microsoft.EntityFrameworkCore;
using String = dotnetapi.Models.Entities.String;

namespace dotnetapi.Services.Strings;

public class StringsRepository : IStringsRepository
{
    private readonly DataContext _context;

    public StringsRepository(DataContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<String>> GetAllStringsByProjectIdAsync(int projectId)
    {
        return await _context.Strings
            .Where(x => x.Project.Id == projectId)
            .Include(x => x.Project)
            .ToListAsync();
    }

    public async Task<String> CreateStringAsync(String request)
    {
        await _context.Strings.AddAsync(request);
        await _context.SaveChangesAsync();
        return request;
    }

    public async Task<String?> GetStringByIdAsync(string stringId)
    {
        return await _context.Strings.FindAsync(stringId);
    }

    public async Task<bool> UpdateStringAsync(UpdateStringRequest request)
    {
        var stringToUpdate = await _context.Strings
            .Where(x => x.Id == request.Id)
            .SingleOrDefaultAsync();

        if (stringToUpdate is null) return false;
        if (request.Name is not null) stringToUpdate.Name = request.Name;
        if (request.Color is not null) stringToUpdate.Color = request.Color;

        var save = await _context.SaveChangesAsync();
        return save > 0;
    }

    public async Task<bool> DeleteStringAsync(String request)
    {
        var stringToDelete = await _context.Strings
            .Where(x => x.Id == request.Id)
            .SingleOrDefaultAsync();
        if (stringToDelete is null) return false;
        var delete = _context.Strings.Remove(stringToDelete);

        return delete.State == EntityState.Deleted;
    }
}