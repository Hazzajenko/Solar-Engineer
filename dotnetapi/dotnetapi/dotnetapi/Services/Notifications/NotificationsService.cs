using dotnetapi.Models.Entities;
using FluentValidation;
using FluentValidation.Results;
using Microsoft.AspNetCore.Identity;

namespace dotnetapi.Services.Notifications;

public interface INotificationsService
{
    Task<Notification> SendNotificationToUserAsync(string username);
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