using dotnetapi.Data;
using dotnetapi.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace dotnetapi.Repositories.Projects;

public class ProjectsRepository : IProjectsRepository
{
    private readonly DataContext _context;

    public ProjectsRepository(DataContext context)
    {
        _context = context;
    }

    public async Task<Project?> GetProjectByIdAsync(int projectId)
    {
        return await _context.Projects.FindAsync(projectId);
    }

    public async Task<Project> CreateProjectAsync(AppUserProject request)
    {
        await _context.AppUserProjects.AddAsync(request);
        await _context.SaveChangesAsync();
        return request.Project;
    }


    public async Task<IEnumerable<Project>> GetAllProjectsByUserIdAsync(int userId)
    {
        return await _context.Projects
            .Where(x => x.CreatedBy.Id == userId)
            .ToListAsync();
    }

    public async Task<bool> UpdateProjectAsync(Project request)
    {
        var projectToUpdate = await _context.Projects
            .Where(x => x.Id == request.Id)
            .SingleOrDefaultAsync();

        if (projectToUpdate is null) return false;

        projectToUpdate.Name = request.Name;
        var save = await _context.SaveChangesAsync();
        return save > 0;
    }

    public async Task<bool> DeleteProjectAsync(Project request)
    {
        var projectToDelete = await _context.Projects
            .Where(x => x.Id == request.Id)
            .SingleOrDefaultAsync();
        if (projectToDelete is null) return false;
        var delete = _context.Projects.Remove(projectToDelete);

        return delete.State == EntityState.Deleted;
    }
}