using DotNetCore.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Users.API.Data;
using Users.API.Entities;

namespace Users.API.Repositories;

public sealed class UserLinksRepository : EFRepository<UserLink>, IUserLinksRepository
{
    public UserLinksRepository(UsersContext context) : base(context)
    {
    }

    public Task<UserLink?> GetByIdAsync(Guid id)
    {
        return Queryable.SingleOrDefaultAsync(auth => auth.Id == id);
    }
}