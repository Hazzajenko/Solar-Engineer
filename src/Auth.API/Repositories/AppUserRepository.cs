using Auth.API.Data;
using Auth.API.Domain;

using DotNetCore.EntityFrameworkCore;

using Microsoft.EntityFrameworkCore;

namespace Auth.API.Repositories;

public sealed class AppUserRepository : EFRepository<AppUser>, IAppUserRepository
{
    public AppUserRepository(AuthContext context) : base(context) { }

    public Task<AppUser?> GetByIdAsync(int id) => Queryable.SingleOrDefaultAsync(auth => auth.Id == id);

}
