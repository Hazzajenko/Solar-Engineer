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

    public async Task<IEnumerable<AppUserFriendDto>> GetSentRequestsAsync(AppUser user)
    {
        var sentRequests = await _usersRepository.GetSentRequestsAsync(user);
        return sentRequests.Select(x => x.ToDto());
    }

    public async Task<IEnumerable<AppUserFriendDto>> GetReceivedRequestsAsync(AppUser user)
    {
        var receivedRequests = await _usersRepository.GetReceivedRequestsAsync(user);
        return receivedRequests.Select(x => x.ToDto());
    }


    public async Task<AppUserFriend> AddFriendAsync(AppUser user, string username)
    {
        var friendUser = await _userManager.FindByNameAsync(username);
        // var friendUser = await _userManager.Users.SingleOrDefaultAsync(x => x.UserName == username.ToLower());
        if (friendUser is null)
        {
            var message = $"User ${username} does not exist";
            throw new ValidationException(message, GenerateValidationError(message));
        }

        /*var currentUser = await _userManager.FindByNameAsync(user.UserName!);
        if (currentUser is null)
        {
            var message = $"User ${username} does not exist";
            throw new ValidationException(message, GenerateValidationError(message));
        }*/

        // var appUserFriend = new AppUserFriend();
        /*var friendRequest = new AppUserFriend
        {
            RequestedBy = user,
            RequestedTo = friendUser,
            RequestTime = DateTime.Now,
            FriendRequestFlag = FriendRequestFlag.None
        };*/
        // user.SentFriendRequests.Add(friendRequest);
        // appUserFriend.AddFriendRequest(user, friendUser);
        /*var friendRequest = new AppUserFriend
        {
            RequestedBy = user,
            RequestedById = user.Id,
            RequestedTo = friendUser,
            RequestedToId = friendUser.Id,
            RequestTime = DateTime.Now,
            FriendRequestFlag = FriendRequestFlag.None
        };*/
        // user.SentFriendRequests.Add(friendRequest);
        // user.SentFriendRequests = new List<AppUserFriend>();
        // user.SentFriendRequests.Add(friendRequest);        
        var friendRequest = new AppUserFriend
        {
            RequestedBy = user,
            RequestedById = user.Id,
            RequestedTo = friendUser,
            RequestedToId = friendUser.Id,
            RequestTime = DateTime.Now,
            FriendRequestFlag = FriendRequestFlag.None
        };
        // user.SentFriendRequests.Add(friendRequest);
        // user.SentFriendRequests = new List<AppUserFriend>();
        // user.SentFriendRequests.Add(friendRequest);
        return await _usersRepository.AddFriendAsync(friendRequest);
    }

    private static ValidationFailure[] GenerateValidationError(string message)
    {
        return new[]
        {
            new ValidationFailure(nameof(AppUser), message)
        };
    }
}