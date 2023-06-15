using Identity.Contracts.Data;
using Identity.Domain;

namespace Identity.Contracts.Responses.Friends;

public class FriendRemovedResponse
{
    public string AppUserId { get; set; } = default!;
}
