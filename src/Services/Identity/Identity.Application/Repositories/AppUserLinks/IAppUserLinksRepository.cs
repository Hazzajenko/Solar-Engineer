using Identity.Contracts.Data;
using Identity.Domain;
using Infrastructure.Repositories;

namespace Identity.Application.Repositories.AppUserLinks;

public interface IAppUserLinksRepository : IEntityToEntityRepository<AppUserLink>
{
    Task<AppUserLink?> GetByBothUsersAsync(AppUser appUser, AppUser recipient);
    Task<IEnumerable<AppUserLinkDto>> GetUserFriendsAsync(Guid appUserId);
    Task<IEnumerable<Guid>> GetUserFriendIdsAsync(Guid appUserId);
}