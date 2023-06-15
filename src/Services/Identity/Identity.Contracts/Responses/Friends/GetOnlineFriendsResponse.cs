using Identity.Contracts.Data;
using Identity.Domain;

namespace Identity.Contracts.Responses.Friends;

public class GetOnlineFriendsResponse
{
    public IEnumerable<AppUserConnectionDto> OnlineFriends { get; set; } = new List<AppUserConnectionDto>();
}