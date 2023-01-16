using dotnetapi.Mapping;
using dotnetapi.Models.Dtos;
using dotnetapi.Models.Entities;
using FluentValidation;
using FluentValidation.Results;
using Microsoft.AspNetCore.Identity;

namespace dotnetapi.Services.Notifications;

public interface INotificationsService
{
    Task<Notification> SendNotificationToUserAsync(string username);

    Task<IEnumerable<NotificationDto<FriendRequestDto>?>> GetAllUserNotifications(string username);
    // Task<Notification> CreateNotificationAsync(Notification notification);
}

public class NotificationsService : INotificationsService
{
    private readonly INotificationsRepository _notificationsRepository;
    private readonly UserManager<AppUser> _userManager;

    public NotificationsService(UserManager<AppUser> userManager, INotificationsRepository notificationsRepository)
    {
        _userManager = userManager;
        _notificationsRepository = notificationsRepository;
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


    /*
    public async Task<Notification> CreateNotificationAsync(Notification notification)
    {
        /*var user = await _userManager.FindByNameAsync(username);
        if (user is null)
        {
            var message = $"Username {username} is invalid";
            throw new ValidationException(message, GenerateValidationError(message));
        }

        var notification = new Notification
        {
            AppUser = user,
            AppUserId = user.Id,
            Status = NotificationStatus.Unread,
            TimeCreated = DateTime.Now,
            Type = NotificationType.FriendRequest
        };

        var result = await _notificationsRepository.SendNotificationToUserAsync(notification);
        return result;#1#
    }*/

    public async Task<Notification> SendNotificationToUserAsync(string username)
    {
        var user = await _userManager.FindByNameAsync(username);
        if (user is null)
        {
            var message = $"Username {username} is invalid";
            throw new ValidationException(message, GenerateValidationError(message));
        }

        var notification = new Notification
        {
            AppUser = user,
            AppUserId = user.Id,
            Status = NotificationStatus.Unread,
            TimeCreated = DateTime.Now,
            Type = NotificationType.FriendRequest
        };

        var result = await _notificationsRepository.SendNotificationToUserAsync(notification);
        return result;
    }

    private static ValidationFailure[] GenerateValidationError(string message)
    {
        return new[]
        {
            new ValidationFailure(nameof(Notification), message)
        };
    }
}