using dotnetapi.Data;
using dotnetapi.Models.Entities;
using dotnetapi.Services.Cache;
using Microsoft.EntityFrameworkCore;

namespace dotnetapi.Repositories.Projects;

public class ProjectsRepository : IProjectsRepository
{
    private readonly DataContext _context;
    private readonly ICacheService _cacheService;

    public ProjectsRepository(DataContext context, ICacheService cacheService)
    {
        _context = context;
        _cacheService = cacheService;
    }

    public async Task<Project?> GetProjectByIdAsync(int projectId)
    {
        return await _context.Projects.FindAsync(projectId);
    }

    public async Task<Project> CreateProjectAsync(AppUserProject request)
    {
        var addedProject = await _context.AppUserProjects.AddAsync(request);
        
        /*var expiryTime = DateTimeOffset.Now.AddSeconds(30);
        _cacheService.SetData<AppUserProject>($"project{addedProject.Entity.Id}", addedProject.Entity, expiryTime);*/
        
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
        _cacheService.RemoveData($"project{request.Id}");

        await _context.SaveChangesAsync();

        return delete.State == EntityState.Deleted;
    }
}