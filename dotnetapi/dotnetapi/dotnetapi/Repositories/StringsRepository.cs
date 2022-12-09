using dotnetapi.Data;
using dotnetapi.Mapping;
using dotnetapi.Models.Dtos;
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

    public async Task<StringDto> CreateStringAsync(String request, CancellationToken cancellationToken)
    {
        await _context.Strings.AddAsync(request, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);
        return request.ToDto();
    }

    public async Task<String?> GetStringByIdAsync(string stringId, CancellationToken cancellationToken)
    {
        return await _context.Strings.FindAsync(stringId, cancellationToken);
    }

    public async Task<IEnumerable<StringDto>> GetAllStringsByProjectIdAsync(int projectId,
        CancellationToken cancellationToken)
    {
        return await _context.Strings
            .Where(x => x.Project.Id == projectId)
            .Select(o => new StringDto
            {
                Id = o.Id,
                ProjectId = o.Project.Id,
                Name = o.Name,
                CreatedBy = new AppUserDto
                {
                    Username = o.CreatedBy.UserName!
                },
                CreatedAt = o.CreatedAt,
                IsInParallel = o.IsInParallel
            })
            .ToListAsync(cancellationToken);
    }

    public async Task<bool> UpdateStringAsync(String request, String changes, CancellationToken cancellationToken)
    {
        var stringToUpdate = await _context.Strings
            .Where(x => x.Id == request.Id)
            .SingleOrDefaultAsync(cancellationToken);

        if (stringToUpdate is null) return false;

        stringToUpdate.Name = changes.Name;
        var save = await _context.SaveChangesAsync(cancellationToken);
        return save > 0;
    }

    public async Task<bool> DeleteAsync(String request, CancellationToken cancellationToken)
    {
        var stringToDelete = await _context.Strings
            .Where(x => x.Id == request.Id)
            .SingleOrDefaultAsync(cancellationToken);
        if (stringToDelete is null) return false;
        var delete = _context.Strings.Remove(stringToDelete);

        return delete.State == EntityState.Deleted;
    }
}