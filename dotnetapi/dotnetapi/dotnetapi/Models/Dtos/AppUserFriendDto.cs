using dotnetapi.Models.Entities;

namespace dotnetapi.Models.Dtos;

public class AppUserFriendDto
{
    public int RequestedById { get; set; }
    public int RequestedToId { get; set; }
    public string RequestedByUsername { get; set; } = default!;
    public string RequestedToUsername { get; set; } = default!;

    public DateTime? RequestTime { get; set; }

    public DateTime? BecameFriendsTime { get; set; }

    public FriendRequestFlag FriendRequestFlag { get; set; }

    // public bool Approved => FriendRequestFlag == FriendRequestFlag.Approved;
}