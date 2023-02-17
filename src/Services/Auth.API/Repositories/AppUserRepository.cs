using Auth.API.Data;
using Auth.API.Entities;
using DotNetCore.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Auth.API.Repositories;

public sealed class AppUserRepository : EFRepository<AppUser>, IAppUserRepository
{
    public AppUserRepository(AuthContext context) : base(context)
    {
    }

    public Task<AppUser?> GetByIdAsync(Guid id)
    {
        return Queryable.SingleOrDefaultAsync(auth => auth.Id == id);
    }
}