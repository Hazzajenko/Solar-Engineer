using Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;
using Users.API.Data;
using Users.API.Entities;

namespace Users.API.Repositories.UserConnections;

public sealed class UserConnectionsRepository : GenericRepository<ConnectionsContext, UserConnection>,
    IUserConnectionsRepository
{
    public UserConnectionsRepository(ConnectionsContext context) : base(context)
    {
    }
    
    public Task<UserConnection?> GetByUserIdAsync(Guid userId)
    {
        return Queryable.SingleOrDefaultAsync(user => user.UserId == userId);
    }
}