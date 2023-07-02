using Identity.Contracts.Data;
using Identity.Domain;
using Infrastructure.Repositories;

namespace Identity.Application.Repositories.AppUserLinks;

public interface IAppUserLinksRepository : IEntityToEntityRepository<AppUserLink>
{
    Task<AppUserLink?> GetByBothUserIdsAsync(Guid appUserId, Guid recipientId);
    Task<AppUserLink?> GetByBothUserIdsAsyncNoTracking(Guid appUserId, Guid recipientId);
    Task<AppUserLink?> GetByBothUserIdsNoTrackingAsync(Guid appUserId, Guid recipientId);
    Task<AppUserLink?> GetByBothUserIdsIncludeBothUsersAsync(Guid appUserId, Guid recipientId);
    Task<IEnumerable<FriendDto>> GetUserFriendsDtosAsync(Guid appUserId);
    Task<IEnumerable<AppUserLink>> GetUserFriendsAsync(Guid appUserId);
    Task<AppUserLink?> GetByBothUsersAsync(AppUser appUser, AppUser recipient);
    Task<IEnumerable<AppUserLinkDto>> GetUserFriendsAsAppUserLinkDtoAsync(Guid appUserId);
    Task<IEnumerable<WebUserDto>> GetUserFriendsAsWebUserDtoAsync(Guid appUserId);
    Task<IEnumerable<Guid>> GetUserFriendIdsAsync(Guid appUserId);
}
