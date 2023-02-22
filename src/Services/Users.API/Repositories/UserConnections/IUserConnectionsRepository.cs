using Infrastructure.Repositories;
using Users.API.Entities;

namespace Users.API.Repositories.UserConnections;

public interface IUserConnectionsRepository : IGenericRepository<UserConnection>
{
    Task<UserConnection?> GetByUserIdAsync(Guid userId);
}