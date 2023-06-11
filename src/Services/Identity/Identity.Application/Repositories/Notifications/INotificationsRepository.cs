using Identity.Contracts.Data;
using Identity.Domain;
using Infrastructure.Repositories;

namespace Identity.Application.Repositories.Notifications;

public interface INotificationsRepository : IGenericRepository<Notification>
{
    Task<IEnumerable<NotificationDto>> GetAppUsersNotificationsAsync(AppUser appUser);
}
