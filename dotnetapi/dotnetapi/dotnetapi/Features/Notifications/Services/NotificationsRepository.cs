using dotnetapi.Data;
using dotnetapi.Features.Notifications.Contracts.Requests;
using dotnetapi.Models.Entities;

namespace dotnetapi.Features.Notifications.Services;

public interface INotificationsRepository
{
    Task<Notification> SendNotificationToUserAsync(Notification request);

    Task<Notification> CreateNotificationAsync(Notification request);

    // Task<IEnumerable<AppUserFriend>> GetAllFriendRequestsAsync(string username);

    // Task<IEnumerable<Notification>> GetAllUserNotifications(string username);
    Task<bool> UpdateNotificationAsync(UpdateNotificationRequest request);
    Task<bool> UpdateFriendRequestAsync(UpdateNotificationRequest request);
    Task<Notification> CreateFriendRequest(FriendRequest request, Notification notificationEntity);
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
        // await _context.Notifications.AddAsync(request);
        await _context.SaveChangesAsync();
        return request;
    }

    public async Task<Notification> CreateNotificationAsync(Notification request)
    {
        // await _context.Notifications.AddAsync(request);
        await _context.SaveChangesAsync();
        return request;
    }

    /*public async Task<IEnumerable<AppUserFriend>> GetAllFriendRequestsAsync(string username)
    {
        return await _context.AppUserFriends.Where(x => x.RequestedTo.UserName == username)
    }*/

    public async Task<Notification> CreateFriendRequest(
        FriendRequest newFriendRequest,
        Notification notificationEntity
    )
    {
        // await _context.FriendRequests.AddAsync(newFriendRequest);
        await _context.SaveChangesAsync();
        /*notificationEntity.FriendRequest = newFriendRequest;
        notificationEntity.FriendRequestId = newFriendRequest.Id;
        newFriendRequest.Notification = notificationEntity;
        newFriendRequest.NotificationId = notificationEntity.Id;*/
        return notificationEntity;
    }

    public async Task<bool> UpdateNotificationAsync(UpdateNotificationRequest request)
    {
        // var notification = await _context.Notifications.Where(x => x.Id == request.Id)
        // .SingleOrDefaultAsync();
        // if (notification is null) return false;

        // if (request.Changes.Status is not null) notification.Status = request.Changes.Status.Value;

        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> UpdateFriendRequestAsync(UpdateNotificationRequest request)
    {
        // var friendRequest = await _context.AppUserFriends.Where(x => x.Id == request.Id).SingleOrDefaultAsync();


        // .SingleOrDefaultAsync();
        // if (friendRequest is null) return false;

        // if (request.Changes.Status is not null) friendRequest.Status = request.Changes.Status.Value;

        await _context.SaveChangesAsync();
        return true;
    }

    /*public async Task<IEnumerable<Notification>> GetAllUserNotifications(string username)
    {
        /*return await _context.Notifications
            .Where(x => x.AppUser.UserName == username)
            .Include(x => x.FriendRequest)
            .Include(x => x.FriendRequest!.RequestedBy)
            .Include(x => x.FriendRequest!.RequestedTo)
            .ToListAsync();#1#
    }*/
}