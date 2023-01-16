using dotnetapi.Models.Dtos;

namespace dotnetapi.Contracts.Responses.Users;

public class FriendRequestsResponse
{
    public IEnumerable<FriendRequestDto> Requests = new List<FriendRequestDto>();
}