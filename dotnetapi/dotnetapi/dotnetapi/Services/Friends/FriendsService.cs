using dotnetapi.Hubs;
using dotnetapi.Hubs.Connections;
using dotnetapi.Mapping;
using dotnetapi.Models.Dtos;
using dotnetapi.Models.Entities;
using dotnetapi.Services.SignalR;
using dotnetapi.Services.Users;
using FluentValidation;
using FluentValidation.Results;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SignalR;

namespace dotnetapi.Services.Friends;

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
    private static readonly ConnectionMapping<string> _connections = new();

    private readonly IConnectionsService _connectionsService;
    private readonly IFriendsRepository _friendsRepository;
    private readonly IHubContext<NotificationHub> _hubContext;
    private readonly UserManager<AppUser> _userManager;
    private readonly IUsersRepository _usersRepository;

    public FriendsService(UserManager<AppUser> userManager, IFriendsRepository friendsRepository,
        IUsersRepository usersRepository, IHubContext<NotificationHub> hubContext,
        IConnectionsService connectionsService)
    {
        _userManager = userManager;
        _friendsRepository = friendsRepository;
        _usersRepository = usersRepository;
        _hubContext = hubContext;
        _connectionsService = connectionsService;
    }

    public async Task<IEnumerable<FriendRequestDto>> GetSentRequestsAsync(AppUser user)
    {
        var sentRequests = await _usersRepository.GetSentRequestsAsync(user);
        return sentRequests.Select(x => x.ToDto());
    }

    public async Task<IEnumerable<FriendRequestDto>> GetReceivedRequestsAsync(AppUser user)
    {
        var receivedRequests = await _usersRepository.GetReceivedRequestsAsync(user);
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
            FriendRequestFlag = FriendRequestFlag.None
        };

        var result = await _usersRepository.AddFriendAsync(friendRequest);
        if (result is null)
        {
            var message = "result is null";
            throw new ValidationException(message, GenerateValidationError(message));
        }

        /*
        var connections = await _connectionsService.GetUserConnections(username);
        if (connections is null)
        {
            var message = "connections is null";
            throw new ValidationException(message, GenerateValidationError(message));
        }*/
        
        var notification = new NotificationDto<FriendRequestDto>
        {
            Username = friendUser.UserName!,
            Status = NotificationStatus.Unread,
            Type = NotificationType.FriendRequest,
            TimeCreated = DateTime.Now,
            Notification = result.ToDto()
        };

        /*var notification

        var connectionIds = connections.Connections.Select(x => x.ConnectionId);
        // await _hubContext.Clients.All.SendAsync("GetNotifications", result.ToDto());
        // await _hubContext.Clients.Clients(connectionIds).SendAsync("GetNotifications", result.ToDto());
        await _hubContext.Clients.User(friendUser.Id.ToString()).SendAsync("GetNotifications", result.ToDto());
        foreach (var connectionId in connectionIds)
            await _hubContext.Clients.Client(connectionId)
                .SendAsync("GetNotifications", result.ToDto());

        foreach (var connectionId in _connections.GetConnections(friendUser.UserName!))
            await _hubContext.Clients.Client(connectionId).SendAsync("GetNotifications", result.ToDto());

        await _hubContext.Clients.Group(friendUser.UserName!).SendAsync("GetNotifications", result.ToDto());
        await _hubContext.Clients.User(friendUser.UserName!).SendAsync("GetNotifications", result.ToDto());*/

        // await _hubContext.Clients.User()
        await _hubContext.Clients.User(friendUser.UserName!).SendAsync("GetNotifications", notification);

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

        var friendRequest = await _usersRepository.GetAppUserFriendAsync(user, friendUser);
        if (friendRequest is null)
        {
            var message = $"No pending friend request from user {username}";
            throw new ValidationException(message, GenerateValidationError(message));
        }

        var updatedAppUserFriend = await _usersRepository.AcceptFriendRequestAsync(friendRequest);

        return updatedAppUserFriend.ToDto();
    }

    public async Task<IEnumerable<FriendDto>> GetAllFriendsAsync(AppUser user)
    {
        var appUserFriends = await _usersRepository.GetAllFriendsAsync(user);
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