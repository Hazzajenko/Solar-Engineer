using dotnetapi.Models.Entities;

namespace dotnetapi.Repositories.Projects;

public interface IProjectsRepository
{
    Task<Project> CreateProjectAsync(AppUserProject request);
    Task<Project?> GetProjectByIdAsync(int projectId);

    Task<IEnumerable<Project>> GetAllProjectsByUserIdAsync(int userId);

    Task<bool> UpdateProjectAsync(Project request);
    Task<bool> DeleteProjectAsync(Project request);
}