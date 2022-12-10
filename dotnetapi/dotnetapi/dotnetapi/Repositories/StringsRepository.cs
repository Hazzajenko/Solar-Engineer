using dotnetapi.Data;
using Microsoft.EntityFrameworkCore;
using String = dotnetapi.Models.Entities.String;

namespace dotnetapi.Repositories;

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

    public async Task<bool> UpdateStringAsync(String request)
    {
        var stringToUpdate = await _context.Strings
            .Where(x => x.Id == request.Id)
            .SingleOrDefaultAsync();

        if (stringToUpdate is null) return false;

        stringToUpdate.Name = request.Name;
        var save = await _context.SaveChangesAsync();
        return save > 0;
    }

    public async Task<bool> DeleteAsync(String request)
    {
        var stringToDelete = await _context.Strings
            .Where(x => x.Id == request.Id)
            .SingleOrDefaultAsync();
        if (stringToDelete is null) return false;
        var delete = _context.Strings.Remove(stringToDelete);

        return delete.State == EntityState.Deleted;
    }
}