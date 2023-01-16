using dotnetapi.Data;
using dotnetapi.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace dotnetapi.Services.Notifications;

public interface INotificationsRepository
{
    Task<Notification> SendNotificationToUserAsync(Notification request);
    Task<Notification> CreateNotificationAsync(Notification request);
    Task<IEnumerable<Notification>> GetAllUserNotifications(string username);
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
        await _context.SaveChangesAsync();
        return request;
    }

    public async Task<Notification> CreateNotificationAsync(Notification request)
    {
        await _context.Notifications.AddAsync(request);
        await _context.SaveChangesAsync();
        return request;
    }

    public async Task<IEnumerable<Notification>> GetAllUserNotifications(string username)
    {
        return await _context.Notifications
            .Where(x => x.AppUser.UserName == username)
            .Include(x => x.FriendRequest)
            .Include(x => x.FriendRequest!.RequestedBy)
            .Include(x => x.FriendRequest!.RequestedTo)
            .ToListAsync();
    }
}