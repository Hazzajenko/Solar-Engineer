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

    public new async Task<Notification?> GetByIdAsync(Guid id)
    {
        return await Queryable
            .Where(x => x.Id == id)
            .Include(x => x.AppUser)
            .Include(x => x.SenderAppUser)
            .FirstOrDefaultAsync();
    }

    public async Task<Notification?> GetNotificationFromSenderToAppUserByTypeAsync(
        Guid senderAppUserId,
        Guid appUserId,
        NotificationType notificationType
    )
    {
        return await Queryable
            .Include(x => x.SenderAppUser)
            .Where(
                x =>
                    x.SenderAppUserId == senderAppUserId
                    && x.AppUserId == appUserId
                    && !x.CancelledBySender
                    && !x.DeletedByAppUser
                    && !x.Completed
                    && x.NotificationType == notificationType
            )
            .FirstOrDefaultAsync();
    }

    public async Task<NotificationDto?> GetNotificationDtoFromSenderToAppUserByTypeAsync(
        Guid senderAppUserId,
        Guid appUserId,
        NotificationType notificationType
    )
    {
        return await Queryable
            .Include(x => x.SenderAppUser)
            .Where(
                x =>
                    x.SenderAppUserId == senderAppUserId
                    && x.AppUserId == appUserId
                    && !x.CancelledBySender
                    && !x.DeletedByAppUser
                    && !x.Completed
                    && x.NotificationType == notificationType
            )
            .ProjectToType<NotificationDto>()
            .FirstOrDefaultAsync();
    }

    public async Task<NotificationDto?> GetNotificationDtoByIdAsync(Guid id)
    {
        return await Queryable
            .Where(x => x.Id == id)
            .Include(x => x.AppUser)
            .Include(x => x.SenderAppUser)
            .ProjectToType<NotificationDto>()
            .FirstOrDefaultAsync();
    }

    public async Task<IEnumerable<NotificationDto>> GetAppUsersNotificationsAsync(AppUser appUser)
    {
        return await Queryable
            .Where(x => x.AppUserId == appUser.Id)
            .OrderByDescending(x => x.CreatedTime)
            .Where(x => !x.CancelledBySender || !x.DeletedByAppUser || !x.Completed)
            .Take(10)
            .ProjectToType<NotificationDto>()
            .ToListAsync();
    }

    public async Task<IEnumerable<Notification>> GetManyNotificationsByIdsAsync(
        IEnumerable<Guid> ids
    )
    {
        return await Queryable.Where(x => ids.Contains(x.Id)).ToListAsync();
    }
}
