using Identity.Application.Data;
using Identity.Application.Mapping;
using Identity.Contracts.Data;
using Identity.Domain;
using Infrastructure.Repositories;
using Mapster;
using Microsoft.EntityFrameworkCore;

namespace Identity.Application.Repositories.AppUsers;

public sealed class AppUsersRepository
    : GenericRepository<IdentityContext, AppUser>,
        IAppUsersRepository
{
    public AppUsersRepository(IdentityContext context)
        : base(context) { }

    public async Task<CurrentUserDto?> GetAppUserDtoByIdAsync(Guid id)
    {
        return await Queryable
            .Where(x => x.Id == id)
            .Select(x => x.ToCurrentUserDto())
            .SingleOrDefaultAsync();
    }

    public async Task<IEnumerable<MinimalAppUserDto>> SearchForAppUserByUserNameAsync(
        string userName
    )
    {
        return await Queryable
            .Where(x => x.UserName.Contains(userName))
            .Select(x => x.Adapt<MinimalAppUserDto>())
            .ToListAsync();
    }

    public async Task<AppUserDto?> GetAppUserDtoByUserNameAsync(string userName)
    {
        return await Queryable
            .Where(x => x.UserName == userName)
            .Select(x => x.Adapt<AppUserDto>())
            .SingleOrDefaultAsync();
    }

    public async Task<AppUserDto?> GetAppUserDtoByEmailAsync(string email)
    {
        return await Queryable
            .Where(x => x.Email == email)
            .Select(x => x.Adapt<AppUserDto>())
            .SingleOrDefaultAsync();
    }
}
