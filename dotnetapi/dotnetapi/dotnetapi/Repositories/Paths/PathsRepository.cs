using dotnetapi.Contracts.Requests.Paths;
using dotnetapi.Data;
using Microsoft.EntityFrameworkCore;
using Path = dotnetapi.Models.Entities.Path;

namespace dotnetapi.Repositories.Paths;

public class PathsRepository : IPathsRepository
{
    private readonly DataContext _context;

    public PathsRepository(DataContext context)
    {
        _context = context;
    }

    public async Task<Path?> GetPathByIdAsync(string pathId)
    {
        return await _context.Paths
            .Where(x => x.Id == pathId)
            .Include(x => x.Project)
            .Include(x => x.String)
            .SingleOrDefaultAsync();
    }

    public async Task<Path> CreatePathAsync(Path request)
    {
        await _context.Paths.AddAsync(request);
        await _context.SaveChangesAsync();
        return request;
    }

    public async Task<IEnumerable<Path>> GetAllPathsByProjectIdAsync(int projectId)
    {
        return await _context.Paths
            .Where(x => x.Project.Id == projectId)
            .Include(x => x.Project)
            .Include(x => x.String)
            .ToListAsync();
    }

    public async Task<bool> UpdatePathAsync(UpdatePathRequest request)
    {
        var pathToUpdate = await _context.Paths
            .Where(x => x.Id == request.Id)
            .SingleOrDefaultAsync();

        if (pathToUpdate is null) return false;

        if (request.Changes.StringId is not null)
        {
            var newString = await _context.Strings
                .Where(x => x.Id == request.Changes.StringId)
                .SingleOrDefaultAsync();
            if (newString is null) return false;


            pathToUpdate.String = newString;
        }

        if (request.Changes.Color is not null)
            pathToUpdate.Color = request.Changes.Color;

        if (request.Changes.Link is not null)
            pathToUpdate.Link = (int)request.Changes.Link;

        if (request.Changes.Count is not null)
            pathToUpdate.Count = (int)request.Changes.Count;


        var save = await _context.SaveChangesAsync();
        return save > 0;
    }

    public async Task<bool> DeletePathAsync(string pathId)
    {
        var pathToDelete = await _context.Paths
            .Where(x => x.Id == pathId)
            .ExecuteDeleteAsync();
        return pathToDelete > 0;
    }
}