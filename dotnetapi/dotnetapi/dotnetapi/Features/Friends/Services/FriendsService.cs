using dotnetapi.Features.Notifications.Services;
using dotnetapi.Hubs;
using dotnetapi.Mapping;
using dotnetapi.Models.Dtos;
using dotnetapi.Models.Entities;
using dotnetapi.Services.SignalR;
using FluentValidation;
using FluentValidation.Results;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SignalR;

namespace dotnetapi.Features.Friends.Services;

public interface IFriendsService
{
    Task<IEnumerable<FriendRequestDto>> GetSentRequestsAsync(AppUser user);
    Task<IEnumerable<FriendRequestDto>> GetReceivedRequestsAsync(AppUser user);
    Task<AppUserFriend> AddFriendAsync(AppUser user, string username);
    Task<FriendRequestDto> AcceptFriendAsync(AppUser user, string username);
    Task<IEnumerable<FriendDto>> GetAllFriendsAsync(AppUser user);
}

public class FriendsService : IFriendsService
{
    // private static readonly ConnectionMapping<string> _connections = new();

    private readonly IConnectionsService _connectionsService;
    private readonly IFriendsRepository _friendsRepository;
    private readonly IHubContext<NotificationsHub> _hubContext;
    private readonly INotificationsRepository _notificationsRepository;
    private readonly INotificationsService _notificationsService;
    private readonly UserManager<AppUser> _userManager;

    public FriendsService(UserManager<AppUser> userManager, IFriendsRepository friendsRepository,
        IHubContext<NotificationsHub> hubContext,
        IConnectionsService connectionsService, INotificationsRepository notificationsRepository,
        INotificationsService notificationsService)
    {
        _userManager = userManager;
        _friendsRepository = friendsRepository;

        _hubContext = hubContext;
        _connectionsService = connectionsService;
        _notificationsRepository = notificationsRepository;
        _notificationsService = notificationsService;
    }

    public async Task<IEnumerable<FriendRequestDto>> GetSentRequestsAsync(AppUser user)
    {
        var sentRequests = await _friendsRepository.GetSentRequestsAsync(user);
        return sentRequests.Select(x => x.ToDto());
    }

    public async Task<IEnumerable<FriendRequestDto>> GetReceivedRequestsAsync(AppUser user)
    {
        var receivedRequests = await _friendsRepository.GetReceivedRequestsAsync(user);
        return receivedRequests.Select(x => x.ToDto());
    }


    public async Task<AppUserFriend> AddFriendAsync(AppUser user, string username)
    {
        var friendUser = await _userManager.FindByNameAsync(username);
        if (friendUser is null)
        {
            var message = $"User ${username} does not exist";
            throw new ValidationException(message, GenerateValidationError(message));
        }

        var friendRequest = new AppUserFriend
        {
            RequestedBy = user,
            RequestedById = user.Id,
            RequestedTo = friendUser,
            RequestedToId = friendUser.Id,
            RequestTime = DateTime.Now,
            FriendRequestFlag = FriendRequestFlag.None,
            Status = NotificationStatus.Unread
            // Type = NotificationType.FriendRequest
        };

        var result = await _friendsRepository.AddFriendAsync(friendRequest);
        if (result is null)
        {
            var message = "result is null";
            throw new ValidationException(message, GenerateValidationError(message));
        }


        return result;
    }

    public async Task<FriendRequestDto> AcceptFriendAsync(AppUser user, string username)
    {
        var friendUser = await _userManager.FindByNameAsync(username);
        if (friendUser is null)
        {
            var message = $"User ${username} does not exist";
            throw new ValidationException(message, GenerateValidationError(message));
        }

        var friendRequest = await _friendsRepository.GetAppUserFriendAsync(user, friendUser);
        if (friendRequest is null)
        {
            var message = $"No pending friend request from user {username}";
            throw new ValidationException(message, GenerateValidationError(message));
        }

        var updatedAppUserFriend = await _friendsRepository.AcceptFriendRequestAsync(friendRequest);

        return updatedAppUserFriend.ToDto();
    }

    public async Task<IEnumerable<FriendDto>> GetAllFriendsAsync(AppUser user)
    {
        var appUserFriends = await _friendsRepository.GetAllFriendsAsync(user);
        return appUserFriends;
    }

    private static ValidationFailure[] GenerateValidationError(string message)
    {
        return new[]
        {
            new ValidationFailure(nameof(AppUser), message)
        };
    }
}