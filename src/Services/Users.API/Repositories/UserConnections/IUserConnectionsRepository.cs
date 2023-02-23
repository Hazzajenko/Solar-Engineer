using Infrastructure.Repositories;
using Users.API.Contracts.Data;
using Users.API.Entities;

namespace Users.API.Repositories.UserConnections;

public interface IUserConnectionsRepository : IGenericRepository<UserConnection>
{
    Task<UserConnection?> GetByUserIdAsync(Guid userId);

    Task<IEnumerable<ConnectionDto>> GetAllConnectionsAsync();
    // Task<bool> DeleteByUserId(Guid userId);
}