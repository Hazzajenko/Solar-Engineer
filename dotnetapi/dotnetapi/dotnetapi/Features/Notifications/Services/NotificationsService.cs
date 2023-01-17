using dotnetapi.Features.Notifications.Contracts.Requests;
using dotnetapi.Hubs;
using dotnetapi.Mapping;
using dotnetapi.Models.Dtos;
using dotnetapi.Models.Entities;
using FluentValidation;
using FluentValidation.Results;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SignalR;

namespace dotnetapi.Features.Notifications.Services;

public interface INotificationsService
{
    Task<Notification> SendFriendRequestToUserAsync(string username, string friendUsername);
    Task<bool> UpdateNotificationAsync(UpdateNotificationRequest request);
    Task<bool[]> UpdateManyNotificationsAsync(UpdateManyNotificationsRequest request);

    Task<IEnumerable<NotificationDto<FriendRequestDto>?>> GetAllUserNotifications(string username);
    // Task<Notification> CreateNotificationAsync(Notification notification);
}

public class NotificationsService : INotificationsService
{
    private readonly IHubContext<NotificationHub> _hubContext;
    private readonly INotificationsRepository _notificationsRepository;
    private readonly UserManager<AppUser> _userManager;

    public NotificationsService(UserManager<AppUser> userManager, INotificationsRepository notificationsRepository,
        IHubContext<NotificationHub> hubContext)
    {
        _userManager = userManager;
        _notificationsRepository = notificationsRepository;
        _hubContext = hubContext;
    }

    public async Task<bool> UpdateNotificationAsync(UpdateNotificationRequest request)
    {
        var update = await _notificationsRepository.UpdateNotificationAsync(request);
        return update;
    }

    public async Task<bool[]> UpdateManyNotificationsAsync(UpdateManyNotificationsRequest request)
    {
        var updates = new bool[request.Updates.Count()];
        var index = 0;
        foreach (var notification in request.Updates)
        {
            /*var update = await _notificationsRepository.UpdateNotificationAsync(notification);
            if (!update)
            {
                // var message = $"No changes made {update.Id}";
                // throw new ValidationException(message, GenerateValidationError(message));
                continue;
            }*/

            updates[index] = await _notificationsRepository.UpdateNotificationAsync(notification);
            
            index++;
        }

        return updates;
    }

    public async Task<IEnumerable<NotificationDto<FriendRequestDto>?>> GetAllUserNotifications(string username)
    {
        var notifications = await _notificationsRepository.GetAllUserNotifications(username);

        var res = notifications.Select(x =>
        {
            if (x.FriendRequest is null) return null;

            var response = new NotificationDto<FriendRequestDto>
            {
                Id = x.Id,
                Username = x.AppUser.UserName!,
                Status = x.Status,
                TimeCreated = x.TimeCreated,
                Type = x.Type,
                Notification = x.FriendRequest.ToFriendRequestDto()
            };

            return response;
        });
        return res;
    }


    public async Task<Notification> SendFriendRequestToUserAsync(string username, string friendUsername)
    {
        var user = await _userManager.FindByNameAsync(username);
        if (user is null)
        {
            var message = $"Username {username} is invalid";
            throw new ValidationException(message, GenerateValidationError(message));
        }

        var friendUser = await _userManager.FindByNameAsync(friendUsername);
        if (friendUser is null)
        {
            var message = $"friendUser {friendUsername} is invalid";
            throw new ValidationException(message, GenerateValidationError(message));
        }

        var notificationEntity = new Notification
        {
            AppUser = friendUser,
            AppUserId = friendUser.Id,
            Status = NotificationStatus.Unread,
            Type = NotificationType.FriendRequest,
            TimeCreated = DateTime.Now
        };

        var friendRequestEntity = new FriendRequest
        {
            Notification = notificationEntity,
            RequestedBy = user,
            RequestedById = user.Id,
            RequestedTo = friendUser,
            RequestedToId = friendUser.Id,
            FriendRequestFlag = FriendRequestFlag.None,
            BecameFriendsTime = null
        };

        notificationEntity.FriendRequest = friendRequestEntity;

        var newNotification = await _notificationsRepository.CreateNotificationAsync(notificationEntity);

        var signalRResponse = new NotificationDto<FriendRequestDto>
        {
            Id = newNotification.Id,
            Username = newNotification.AppUser.UserName!,
            Status = newNotification.Status,
            TimeCreated = newNotification.TimeCreated,
            Type = newNotification.Type,
            Notification = friendRequestEntity.ToFriendRequestDto()
        };

        await _hubContext.Clients.User(friendUser.UserName!).SendAsync("GetNotifications", signalRResponse);

        // var result = await _notificationsRepository.SendNotificationToUserAsync(notification);
        return newNotification;
    }

    private static ValidationFailure[] GenerateValidationError(string message)
    {
        return new[]
        {
            new ValidationFailure(nameof(Notification), message)
        };
    }
}