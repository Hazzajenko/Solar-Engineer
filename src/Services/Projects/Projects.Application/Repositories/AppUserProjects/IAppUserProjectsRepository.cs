using Infrastructure.Repositories;
using Projects.Contracts.Data;
using Projects.Domain.Entities;

namespace Projects.Application.Repositories.AppUserProjects;

public interface IAppUserProjectsRepository : IEntityToEntityRepository<AppUserProject>
{
    Task<IEnumerable<AppUserProject>> GetByAppUserIdAsync(Guid appUserId);
    Task<IEnumerable<ProjectDto>> GetProjectsByAppUserIdAsync(Guid appUserId);

    Task<IEnumerable<ProjectDto>> GetProjectsWithMembersByAppUserIdAsync(Guid appUserId);
    Task<AppUserProject?> GetByAppUserIdAndProjectIdAsync(Guid appUserId, Guid projectId);
    Task<ProjectDto?> GetProjectByAppUserAndProjectIdAsync(Guid appUserId, Guid projectId);
    Task<IEnumerable<string>> GetProjectMemberIdsByProjectId(Guid projectId);
    Task<IEnumerable<string>> GetActiveProjectMemberIdsByProjectId(Guid projectId);
}
