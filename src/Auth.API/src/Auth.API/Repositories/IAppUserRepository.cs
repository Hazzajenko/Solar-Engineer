using Auth.API.Domain;

using DotNetCore.Repositories;

namespace Auth.API.Repositories;

public interface IAppUserRepository : IRepository<AppUser>
{
    Task<AppUser?> GetByIdAsync(int id);
}
