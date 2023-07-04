using Infrastructure.Repositories;
using Projects.Domain.Entities;

namespace Projects.Application.Repositories.ProjectUsers;

public interface IProjectUsersRepository : IGenericRepository<ProjectUser>
{
    Task<Guid?> GetSelectedProjectIdByAppUserIdAsync(Guid appUserId);

    Task<bool> SetSelectedProjectIdByAppUserIdAsync(Guid appUserId, Guid? selectedProjectId);
}
