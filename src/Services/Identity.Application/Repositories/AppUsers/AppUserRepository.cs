using Identity.Application.Data;
using Identity.Application.Entities;
using Identity.Application.Mapping;
using Identity.Contracts.Data;
using Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;

namespace Identity.Application.Repositories.AppUsers;

public sealed class AppUserRepository
    : GenericRepository<IdentityContext, AppUser>,
        IAppUserRepository
{
    public AppUserRepository(IdentityContext context)
        : base(context)
    {
    }

    public async Task<CurrentUserDto?> GetAppUserDtoByIdAsync(Guid id)
    {
        return await Queryable
            .Where(x => x.Id == id)
            .Select(x => x.ToCurrentUserDto())
            .SingleOrDefaultAsync();
    }
}