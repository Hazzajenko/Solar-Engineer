using Auth.API.Entities;
using DotNetCore.Repositories;

namespace Auth.API.Repositories;

public interface IAppUserRepository : IRepository<AppUser>
{
    Task<AppUser?> GetByIdAsync(Guid id);
}