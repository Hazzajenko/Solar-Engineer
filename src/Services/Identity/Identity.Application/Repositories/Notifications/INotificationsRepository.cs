using Identity.Contracts.Data;
using Identity.Domain;
using Infrastructure.Repositories;

namespace Identity.Application.Repositories.Notifications;

public interface INotificationsRepository : IGenericRepository<Notification>
{
    new Task<Notification?> GetByIdAsync(Guid id);
    Task<IEnumerable<Notification>> GetManyNotificationsByIdsAsync(IEnumerable<Guid> ids);

    Task<Notification?> GetNotificationFromSenderToAppUserByTypeAsync(
        Guid senderAppUserId,
        Guid appUserId,
        NotificationType notificationType
    );

    Task<NotificationDto?> GetNotificationDtoFromSenderToAppUserByTypeAsync(
        Guid senderAppUserId,
        Guid appUserId,
        NotificationType notificationType
    );
    Task<NotificationDto?> GetNotificationDtoByIdAsync(Guid id);
    Task<IEnumerable<NotificationDto>> GetAppUsersNotificationsAsync(AppUser appUser);
}
