using Infrastructure.Repositories;
using Projects.Contracts.Data;
using Projects.Domain.Entities;

namespace Projects.Application.Repositories.AppUserSelectedProjects;

public interface IAppUserSelectedProjectsRepository : IGenericRepository<AppUserSelectedProject>
{
    Task<Guid?> GetSelectedProjectIdByAppUserIdAsync(Guid appUserId);
    Task<IEnumerable<Guid>> GetActiveUsersInProjectByProjectIdAsync(Guid projectId);
    Task<bool> AddOrUpdateAsync(Guid appUserId, Guid? projectId);
}
