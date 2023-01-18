using dotnetapi.Features.Friends.Services;
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
    Task<bool> MarkNotificationAsReadAsync(UpdateNotificationRequest request);
    Task<bool[]> MarkManyNotificationsAsReadAsync(UpdateManyNotificationsRequest request);
    Task<bool> UpdateNotificationAsync(UpdateNotificationRequest request);
    Task<AppUserFriend> CreateFriendRequestToUserAsync(AppUserFriend request);

    Task<IEnumerable<NotificationDto>> GetAllUserNotifications(AppUser user);
    // Task<Notification> CreateNotificationAsync(Notification notification);
}

public class NotificationsService : INotificationsService
{
    private readonly IFriendsRepository _friendsRepository;
    private readonly IHubContext<NotificationHub> _hubContext;
    private readonly INotificationsRepository _notificationsRepository;
    private readonly UserManager<AppUser> _userManager;

    public NotificationsService(UserManager<AppUser> userManager, INotificationsRepository notificationsRepository,
        IHubContext<NotificationHub> hubContext, IFriendsRepository friendsRepository)
    {
        _userManager = userManager;
        _notificationsRepository = notificationsRepository;
        _hubContext = hubContext;
        _friendsRepository = friendsRepository;
    }

    public async Task<bool> MarkNotificationAsReadAsync(UpdateNotificationRequest request)
    {
        var update = await _notificationsRepository.UpdateNotificationAsync(request);
        return update;
    }

    public async Task<bool> UpdateNotificationAsync(UpdateNotificationRequest request)
    {
        if (request.Type == NotificationType.FriendRequest)
            return await _notificationsRepository.UpdateFriendRequestAsync(request);
        // UpdateFriendRequestAsync
        // var update = await _notificationsRepository.UpdateNotificationAsync(request);
        // return update;
        return false;
    }

    public async Task<bool[]> MarkManyNotificationsAsReadAsync(UpdateManyNotificationsRequest request)
    {
        var updates = new bool[request.Updates.Count()];
        var index = 0;
        foreach (var notification in request.Updates)
        {
            updates[index] = await _notificationsRepository.UpdateNotificationAsync(notification);
            index++;
        }

        return updates;
    }

    public async Task<IEnumerable<NotificationDto>> GetAllUserNotifications(AppUser user)
    {
        var notifications = await _friendsRepository.GetReceivedRequestsAsync(user);


        return notifications.Select(x => x.ToNotificationDto());
    }

    /*public async Task<IEnumerable<NotificationDto<FriendRequestDto>?>> GetAllUserNotifications(string username)
    {
        // var notifications = await _notificationsRepository.GetAllUserNotifications(username);

        /*var res = notifications.Select(x =>
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
        return res;#1#
    }*/


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
            // Notification = notificationEntity,
            RequestedBy = user,
            RequestedById = user.Id,
            RequestedTo = friendUser,
            RequestedToId = friendUser.Id,
            FriendRequestFlag = FriendRequestFlag.None,
            BecameFriendsTime = null
        };

        var newNotification =
            await _notificationsRepository.CreateFriendRequest(friendRequestEntity, notificationEntity);

        /*
        notificationEntity.FriendRequest = newFriendRequest;
        notificationEntity.FriendRequestId = newFriendRequest.Id;

        var newNotification = await _notificationsRepository.CreateNotificationAsync(notificationEntity);*/

        var signalRResponse = new NotificationDto
        {
            Id = newNotification.Id,
            Username = newNotification.AppUser.UserName!,
            Status = newNotification.Status,
            RequestTime = newNotification.TimeCreated,
            Type = newNotification.Type,
            FriendRequest = friendRequestEntity.ToFriendRequestDto()
        };

        await _hubContext.Clients.User(friendUser.UserName!).SendAsync("GetNotifications", signalRResponse);

        // var result = await _notificationsRepository.SendNotificationToUserAsync(notification);
        return newNotification;
    }

    public async Task<AppUserFriend> CreateFriendRequestToUserAsync(AppUserFriend request)
    {
        await _hubContext.Clients.User(request.RequestedTo.UserName!)
            .SendAsync("GetNotifications", request.ToNotificationDto());

        return request;
    }

    private static ValidationFailure[] GenerateValidationError(string message)
    {
        return new[]
        {
            new ValidationFailure(nameof(Notification), message)
        };
    }
}