using dotnetapi.Data;
using dotnetapi.Models.Entities;

namespace dotnetapi.Services.Notifications;

public interface INotificationsRepository
{
    Task<Notification> SendNotificationToUserAsync(Notification request);
}

public class NotificationsRepository : INotificationsRepository
{
    private readonly DataContext _context;

    public NotificationsRepository(DataContext context)
    {
        _context = context;
    }

    public async Task<Notification> SendNotificationToUserAsync(Notification request)
    {
        await _context.Notifications.AddAsync(request);
        return request;
    }
}