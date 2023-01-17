using dotnetapi.Models.Dtos;

namespace dotnetapi.Contracts.Responses.Friends;

public class AcceptFriendResponse
{
    // public bool Accepted { get; set; }
    public FriendDto Friend { get; set; } = default!;
}