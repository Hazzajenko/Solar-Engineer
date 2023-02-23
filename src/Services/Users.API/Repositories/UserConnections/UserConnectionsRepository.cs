using Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;
using Users.API.Contracts.Data;
using Users.API.Data;
using Users.API.Entities;
using Users.API.Mapping;

namespace Users.API.Repositories.UserConnections;

public sealed class UserConnectionsRepository : GenericRepository<ConnectionsContext, UserConnection>,
    IUserConnectionsRepository
{
    public UserConnectionsRepository(ConnectionsContext context) : base(context)
    {
    }

    public async Task<UserConnection?> GetByUserIdAsync(Guid userId)
    {
        return await Queryable.SingleOrDefaultAsync(user => user.UserId == userId);
    }

    public async Task<IEnumerable<ConnectionDto>> GetAllConnectionsAsync()
    {
        return await Queryable.Select(x => x.ToDto()).ToListAsync();
    }
}