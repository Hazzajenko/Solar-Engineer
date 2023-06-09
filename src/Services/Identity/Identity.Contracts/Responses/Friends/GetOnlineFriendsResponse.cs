using Identity.Domain;

namespace Identity.Contracts.Responses.Friends;

public class GetOnlineFriendsResponse
{
    public IEnumerable<AppUserConnection> OnlineFriends { get; set; } = new List<AppUserConnection>();
}