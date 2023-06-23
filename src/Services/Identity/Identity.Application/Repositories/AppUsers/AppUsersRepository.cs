using Identity.Application.Data;
using Identity.Application.Mapping;
using Identity.Contracts.Data;
using Identity.Domain;
using Infrastructure.Repositories;
using Infrastructure.SignalR;
using Mapster;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace Identity.Application.Repositories.AppUsers;

public sealed class AppUsersRepository
    : GenericRepository<IdentityContext, AppUser>,
        IAppUsersRepository
{
    public AppUsersRepository(IdentityContext context)
        : base(context) { }

    public async Task<AppUser> GetCurrentUserAsync(HubCallerContext context)
    {
        return await Queryable.Where(x => x.Id == context.ToAuthUser().Id).SingleOrDefaultAsync()
            ?? throw new HubException("User is not authenticated.");
    }

    public async Task<AppUser?> GetByUserNameAsync(string userName)
    {
        return await Queryable.Where(x => x.UserName == userName).SingleOrDefaultAsync();
    }

    public async Task<IEnumerable<AppUser>> GetManyAppUsersByIdsAsync(IEnumerable<Guid> ids)
    {
        return await Queryable.Where(x => ids.Contains(x.Id)).ToListAsync();
    }

    public async Task<IEnumerable<AppUserDto>> GetManyAppUserDtosByIdsAsync(IEnumerable<Guid> ids)
    {
        return await Queryable
            .Where(x => ids.Contains(x.Id))
            .ProjectToType<AppUserDto>()
            .ToListAsync();
    }

    /*public async Task<IEnumerable<WebUserDto>> GetManyWebUserDtosByIdsAsync(
        IEnumerable<Guid> webUserIds
    )
    {
        return await Queryable
            .Where(x => webUserIds.Contains(x.Id))
            .Select(x => x.ToWebUserDto(appUserId))
            .ToListAsync();
    }*/

    public async Task<AppUserDto?> GetAppUserDtoByIdAsync(Guid id)
    {
        return await Queryable
            .Where(x => x.Id == id)
            .ProjectToType<AppUserDto>()
            .SingleOrDefaultAsync();
    }

    public async Task<IEnumerable<WebUserDto>> SearchForUsersExcludingIdsAsync(
        string searchQuery,
        IEnumerable<Guid> ids
    )
    {
        return await Queryable
            .Where(
                x =>
                    (x.UserName.Contains(searchQuery) || x.DisplayName.Contains(searchQuery))
                    && !ids.Contains(x.Id)
            )
            .Select(x => x.ToWebUserDto())
            // .ProjectToType<WebUserDto>()
            .ToListAsync();
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
