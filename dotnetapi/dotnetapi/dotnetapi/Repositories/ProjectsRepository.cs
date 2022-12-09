using dotnetapi.Data;
using dotnetapi.Mapping;
using dotnetapi.Models.Dtos;
using dotnetapi.Models.Entities;

namespace dotnetapi.Repositories;

public class ProjectsRepository : IProjectsRepository
{
    private readonly DataContext _context;
    public ProjectsRepository(DataContext context)
    {
        _context = context;
    }
    
    public async Task<Project?> GetById(int projectId, CancellationToken cancellationToken)
    {
        // return _context.Projects.Find(projectId, cancellationToken);
        return await _context.Projects.FindAsync(projectId, cancellationToken);
    }

    public async Task<ProjectDto> CreateProject(AppUserProject request, CancellationToken cancellationToken)
    {
        await _context.AppUserProjects.AddAsync(request, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);
        return request.Project.ToDto();
    }
}