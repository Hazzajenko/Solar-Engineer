using DotNetCore.Repositories;
using Users.API.Entities;

namespace Users.API.Repositories;

public interface IUserLinksRepository : IRepository<UserLink>
{
    Task<UserLink?> GetByIdAsync(Guid id);
}