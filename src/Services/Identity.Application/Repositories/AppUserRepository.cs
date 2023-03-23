using Identity.Application.Data;
using Identity.Application.Entities;
using Infrastructure.Repositories;

namespace Identity.Application.Repositories;

public sealed class AppUserRepository : GenericRepository<IdentityContext, AppUser>, IAppUserRepository
{
    public AppUserRepository(IdentityContext context) : base(context)
    {
    }
}