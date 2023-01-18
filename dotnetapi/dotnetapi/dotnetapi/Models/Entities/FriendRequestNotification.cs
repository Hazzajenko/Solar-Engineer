namespace dotnetapi.Models.Entities;

public class FriendRequestNotification : NotificationBase
{
    public int RequestedById { get; set; } = default!;
    public AppUser RequestedBy { get; set; } = default!;
    public int RequestedToId { get; set; } = default!;
    public AppUser RequestedTo { get; set; } = default!;
    public DateTime? BecameFriendsTime { get; set; }
    public FriendRequestFlag FriendRequestFlag { get; set; }
}