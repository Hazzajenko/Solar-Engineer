using Identity.Application.Data;
using Identity.Application.Mapping;
using Identity.Contracts.Data;
using Identity.Domain;
using Infrastructure.Repositories;
using Mapster;
using Microsoft.EntityFrameworkCore;

namespace Identity.Application.Repositories.AppUserLinks;

public sealed class AppUserLinksRepository
    : EntityToEntityRepository<IdentityContext, AppUserLink>,
        IAppUserLinksRepository
{
    public AppUserLinksRepository(IdentityContext context)
        : base(context) { }

    public async Task<AppUserLink?> GetByBothUserIdsAsync(Guid appUserId, Guid recipientId)
    {
        return await Queryable
            .Where(
                m =>
                    (m.AppUserRequestedId == appUserId && m.AppUserReceivedId == recipientId)
                    || (m.AppUserRequestedId == recipientId && m.AppUserReceivedId == appUserId)
            )
            .SingleOrDefaultAsync();
    }

    public async Task<AppUserLink?> GetByBothUserIdsIncludeBothUsersAsync(
        Guid appUserId,
        Guid recipientId
    )
    {
        return await Queryable
            .Where(
                m =>
                    (m.AppUserRequestedId == appUserId && m.AppUserReceivedId == recipientId)
                    || (m.AppUserRequestedId == recipientId && m.AppUserReceivedId == appUserId)
            )
            .Include(x => x.AppUserReceived)
            .Include(x => x.AppUserRequested)
            .SingleOrDefaultAsync();
    }

    public async Task<AppUserLink?> GetByBothUserIdsNoTrackingAsync(
        Guid appUserId,
        Guid recipientId
    )
    {
        return await Queryable
            .AsNoTracking()
            .Where(
                m =>
                    (m.AppUserRequestedId == appUserId && m.AppUserReceivedId == recipientId)
                    || (m.AppUserRequestedId == recipientId && m.AppUserReceivedId == appUserId)
            )
            .FirstOrDefaultAsync();
    }

    public async Task<AppUserLink?> GetByBothUsersAsync(AppUser appUser, AppUser recipient)
    {
        return await Queryable
            .Where(
                m =>
                    (m.AppUserRequestedId == appUser.Id && m.AppUserReceivedId == recipient.Id)
                    || (m.AppUserRequestedId == recipient.Id && m.AppUserReceivedId == appUser.Id)
            )
            .SingleOrDefaultAsync();
    }

    public async Task<IEnumerable<FriendDto>> GetUserFriendsDtosAsync(Guid appUserId)
    {
        return await Queryable
            .Where(
                x =>
                    (x.AppUserReceivedId == appUserId || x.AppUserRequestedId == appUserId)
                    && x.Friends
            )
            .Include(x => x.AppUserReceived)
            .Include(x => x.AppUserRequested)
            .Select(x => x.ToFriendDto(appUserId))
            .ToListAsync();
    }

    public async Task<IEnumerable<WebUserDto>> GetUserFriendsAsWebUserDtoAsync(Guid appUserId)
    {
        return await Queryable
            .Where(
                x =>
                    (x.AppUserReceivedId == appUserId || x.AppUserRequestedId == appUserId)
                    && x.Friends
            )
            .Include(x => x.AppUserReceived)
            .Include(x => x.AppUserRequested)
            .Select(x => x.ToWebUserDto(appUserId))
            .ToListAsync();
    }

    public async Task<IEnumerable<AppUserLinkDto>> GetUserFriendsAsAppUserLinkDtoAsync(
        Guid appUserId
    )
    {
        return await Queryable
            .Where(
                x =>
                    (x.AppUserReceivedId == appUserId || x.AppUserRequestedId == appUserId)
                    && x.Friends
            )
            .Select(x => x.Adapt<AppUserLinkDto>())
            .ToListAsync();
    }

    public async Task<IEnumerable<Guid>> GetUserFriendIdsAsync(Guid appUserId)
    {
        return await Queryable
            .Where(
                x =>
                    (x.AppUserReceivedId == appUserId || x.AppUserRequestedId == appUserId)
                    && x.Friends
            )
            .Select(
                x => x.AppUserReceivedId == appUserId ? x.AppUserRequestedId : x.AppUserReceivedId
            )
            .ToListAsync();
    }
}
