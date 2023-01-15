using dotnetapi.Models.Dtos;

namespace dotnetapi.Contracts.Responses.Users;

public class AllFriendsResponse
{
    public IEnumerable<FriendDto> Friends { get; set; } = new List<FriendDto>();
}