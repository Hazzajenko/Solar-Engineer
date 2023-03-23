using Identity.Application.Entities;
using Identity.Contracts.Data;
using Infrastructure.Repositories;

namespace Identity.Application.Repositories.UserConnections;

public interface IUserConnectionsRepository : IGenericRepository<UserConnection>
{
    Task<UserConnection?> GetByUserIdAsync(Guid userId);

    Task<IEnumerable<ConnectionDto>> GetAllConnectionsAsync();
    // Task<bool> DeleteByUserId(Guid userId);
}