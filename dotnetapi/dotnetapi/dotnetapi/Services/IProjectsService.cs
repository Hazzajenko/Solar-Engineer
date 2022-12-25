using dotnetapi.Models.Dtos.Projects;
using dotnetapi.Models.Entities;

namespace dotnetapi.Services;

public interface IProjectsService
{
    Task<ProjectDto> CreateProjectAsync(AppUserProject appUserProject);
    Task<ProjectDto?> GetProjectByIdAsync(int projectId);

    Task<IEnumerable<ProjectDto>> GetAllProjectsByUserIdAsync(int userId);

    Task<bool> UpdateProjectAsync(Project request);
    Task<bool> DeleteProjectAsync(int projectId);
}