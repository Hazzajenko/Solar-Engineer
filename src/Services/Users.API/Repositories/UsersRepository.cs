using DotNetCore.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Users.API.Data;
using Users.API.Entities;

namespace Users.API.Repositories;

public sealed class UsersRepository : EFRepository<User>, IUsersRepository
{
    public UsersRepository(UsersContext context) : base(context)
    {
    }

    public Task<User?> GetByIdAsync(Guid id)
    {
        return Queryable.SingleOrDefaultAsync(user => user.Id == id);
    }
}