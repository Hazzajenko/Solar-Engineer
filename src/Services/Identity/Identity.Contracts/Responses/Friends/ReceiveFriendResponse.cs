using Identity.Contracts.Data;
using Identity.Domain;

namespace Identity.Contracts.Responses.Friends;

public class ReceiveFriendResponse
{
    public WebUserDto Friend { get; set; } = default!;
}