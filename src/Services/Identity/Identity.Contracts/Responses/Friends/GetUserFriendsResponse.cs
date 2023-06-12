using Identity.Contracts.Data;
using Identity.Domain;

namespace Identity.Contracts.Responses.Friends;

public class GetUserFriendsResponse
{
    public IEnumerable<FriendDto> Friends { get; set; } = new List<FriendDto>();
}
