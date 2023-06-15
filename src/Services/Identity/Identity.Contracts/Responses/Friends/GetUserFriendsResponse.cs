using Identity.Contracts.Data;
using Identity.Domain;

namespace Identity.Contracts.Responses.Friends;

public class GetUserFriendsResponse
{
    public IEnumerable<WebUserDto> Friends { get; set; } = new List<WebUserDto>();
}
