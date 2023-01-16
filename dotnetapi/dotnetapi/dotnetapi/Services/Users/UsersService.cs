using dotnetapi.Mapping;
using dotnetapi.Models.Dtos;
using dotnetapi.Models.Entities;
using FluentValidation;
using FluentValidation.Results;
using Microsoft.AspNetCore.Identity;

namespace dotnetapi.Services.Users;

public class UsersService : IUsersService
{
    private readonly UserManager<AppUser> _userManager;
    private readonly IUsersRepository _usersRepository;

    public UsersService(UserManager<AppUser> userManager, IUsersRepository usersRepository)
    {
        _userManager = userManager;
        _usersRepository = usersRepository;
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

        return await _usersRepository.AddFriendAsync(friendRequest);
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