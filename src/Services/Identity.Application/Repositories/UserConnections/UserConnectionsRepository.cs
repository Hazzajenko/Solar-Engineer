using Identity.Application.Data;
using Identity.Application.Entities;
using Identity.Application.Mapping;
using Identity.Contracts.Data;
using Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;

namespace Identity.Application.Repositories.UserConnections;

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