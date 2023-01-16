using dotnetapi.Models.Dtos;
using dotnetapi.Models.Entities;

namespace dotnetapi.Services.Users;

public interface IUsersService
{
    Task<IEnumerable<FriendRequestDto>> GetSentRequestsAsync(AppUser user);
    Task<IEnumerable<FriendRequestDto>> GetReceivedRequestsAsync(AppUser user);
    Task<AppUserFriend> AddFriendAsync(AppUser user, string username);
    Task<FriendRequestDto> AcceptFriendAsync(AppUser user, string username);
    Task<IEnumerable<FriendDto>> GetAllFriendsAsync(AppUser user);
}