using DotNetCore.Repositories;
using Users.API.Entities;

// using AppUser = Users.API.Entities.AppUser;

namespace Users.API.Repositories;

public interface IUsersRepository : IRepository<User>
{
    Task<User?> GetByIdAsync(Guid id);
}