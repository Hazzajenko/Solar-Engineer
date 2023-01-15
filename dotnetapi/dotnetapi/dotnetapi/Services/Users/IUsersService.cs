using dotnetapi.Models.Dtos;
using dotnetapi.Models.Entities;

namespace dotnetapi.Services.Users;

public interface IUsersService
{
    Task<IEnumerable<AppUserFriendDto>> GetSentRequestsAsync(AppUser user);
    Task<IEnumerable<AppUserFriendDto>> GetReceivedRequestsAsync(AppUser user);
    Task<AppUserFriend> AddFriendAsync(AppUser user, string username);
    Task<AppUserFriendDto> AcceptFriendAsync(AppUser user, string username);
    Task<IEnumerable<FriendDto>> GetAllFriendsAsync(AppUser user);
}