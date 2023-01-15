using dotnetapi.Models.Dtos;

namespace dotnetapi.Contracts.Responses.Users;

public class FriendRequestsResponse
{
    public IEnumerable<AppUserFriendDto> Requests = new List<AppUserFriendDto>();
}