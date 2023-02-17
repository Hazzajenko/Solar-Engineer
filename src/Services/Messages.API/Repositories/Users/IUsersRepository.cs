using Infrastructure.Repositories;
using Messages.API.Entities;

namespace Messages.API.Repositories.Users;

public interface IUsersRepository : IGenericRepository<User>
{
    Task UpdateAsync(User user);
}