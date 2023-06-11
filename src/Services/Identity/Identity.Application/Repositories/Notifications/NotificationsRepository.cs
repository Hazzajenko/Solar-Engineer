using Identity.Application.Data;
using Identity.Contracts.Data;
using Identity.Domain;
using Infrastructure.Repositories;
using Mapster;
using Microsoft.EntityFrameworkCore;

namespace Identity.Application.Repositories.Notifications;

public sealed class NotificationsRepository
    : GenericRepository<IdentityContext, Notification>,
        INotificationsRepository
{
    public NotificationsRepository(IdentityContext context)
        : base(context) { }

    public async Task<IEnumerable<NotificationDto>> GetAppUsersNotificationsAsync(AppUser appUser)
    {
        return await Queryable
            .Where(x => x.AppUserId == appUser.Id)
            .OrderBy(x => x.CreatedTime)
            .Where(x => !x.SeenByAppUser || x.CancelledBySender || x.DeletedByAppUser)
            .Take(10)
            .ProjectToType<NotificationDto>()
            .ToListAsync();
    }
}
