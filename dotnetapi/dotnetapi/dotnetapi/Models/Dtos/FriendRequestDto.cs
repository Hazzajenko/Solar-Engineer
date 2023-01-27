using dotnetapi.Models.Entities;

namespace dotnetapi.Models.Dtos;

public class FriendRequestDto
{
    /*public int RequestedById { get; set; }
    public int RequestedToId { get; set; }*/
    public string RequestedByUserName { get; set; } = default!;
    public string RequestedToUserName { get; set; } = default!;

    // public DateTime? RequestTime { get; set; }

    public DateTime? BecameFriendsTime { get; set; }

    public FriendRequestFlag FriendRequestFlag { get; set; }

    // public bool Approved => FriendRequestFlag == FriendRequestFlag.Approved;
}