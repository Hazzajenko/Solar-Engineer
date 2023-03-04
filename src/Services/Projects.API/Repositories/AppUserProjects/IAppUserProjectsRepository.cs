using Infrastructure.Repositories;
using Projects.API.Contracts.Data;
using Projects.API.Entities;

namespace Projects.API.Repositories.AppUserProjects;

public interface IAppUserProjectsRepository : IGenericRepository<AppUserProject>
{
    Task<IEnumerable<AppUserProject>> GetByAppUserIdAsync(Guid appUserId);
    Task<IEnumerable<ProjectDto>> GetProjectsByAppUserIdAsync(Guid appUserId);
    Task<AppUserProject> GetByAppUserIdAndProjectIdAsync(Guid appUserId, Guid projectId);
    Task<ProjectDto?> GetProjectByAppUserAndProjectIdAsync(Guid appUserId, Guid projectId);
    Task<IEnumerable<string>> GetProjectMemberIdsByProjectId(Guid projectId);
}