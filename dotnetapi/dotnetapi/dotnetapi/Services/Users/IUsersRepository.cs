using dotnetapi.Models.Dtos;
using dotnetapi.Models.Entities;

namespace dotnetapi.Services.Users;

public interface IUsersRepository
{
    Task<IEnumerable<AppUserFriend>> GetSentRequestsAsync(AppUser user);
    Task<IEnumerable<AppUserFriend>> GetReceivedRequestsAsync(AppUser user);
    Task<AppUserFriend> AddFriendAsync(AppUserFriend request);
    Task<AppUserFriend?> GetAppUserFriendAsync(AppUser user, AppUser friend);
    Task<AppUserFriend> AcceptFriendRequestAsync(AppUserFriend request);
    Task<IEnumerable<FriendDto>> GetAllFriendsAsync(AppUser user);
}