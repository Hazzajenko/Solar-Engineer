using DotNetCore.Repositories;
using Infrastructure.Entities.Identity;

namespace Auth.API.Repositories;

public interface IAppUserRepository : IRepository<AppUser>
{
    Task<AppUser?> GetByIdAsync(Guid id);
}