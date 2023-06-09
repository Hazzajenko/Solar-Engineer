using Identity.Application.Data;
using Identity.Contracts.Data;
using Identity.Domain;
using Infrastructure.Repositories;
using Mapster;
using Microsoft.EntityFrameworkCore;

namespace Identity.Application.Repositories.AppUserLinks;

public sealed class AppUserLinksRepository : EntityToEntityRepository<IdentityContext, AppUserLink>,
    IAppUserLinksRepository
{
    public AppUserLinksRepository(IdentityContext context) : base(context)
    {
    }

    public async Task<AppUserLink?> GetByBothUsersAsync(AppUser appUser, AppUser recipient)
    {
        return await Queryable
            .Where(m => (m.AppUserRequestedId == appUser.Id
                         && m.AppUserReceivedId ==
                         recipient.Id)
                        || (m.AppUserRequestedId == recipient.Id
                            && m.AppUserReceivedId == appUser.Id)
            )
            .SingleOrDefaultAsync();
    }

    public async Task<IEnumerable<AppUserLinkDto>> GetUserFriendsAsync(Guid appUserId)
    {
        return await Queryable
            .Where(x =>
                (x.AppUserReceivedId == appUserId || x.AppUserRequestedId == appUserId)
                && x.Friends
            )
            .Select(x => x.Adapt<AppUserLinkDto>())
            .ToListAsync();
    }

    public async Task<IEnumerable<Guid>> GetUserFriendIdsAsync(Guid appUserId)
    {
        return await Queryable
            .Where(x =>
                (x.AppUserReceivedId == appUserId || x.AppUserRequestedId == appUserId)
                && x.Friends
            )
            .Select(x => x.AppUserReceivedId == appUserId ? x.AppUserRequestedId : x.AppUserReceivedId)
            .ToListAsync();
    }
}