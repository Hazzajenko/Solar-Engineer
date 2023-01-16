using dotnetapi.Models.Dtos;

namespace dotnetapi.Models.Entities;

public class Notification : BaseEntity
{
    public int AppUserId { get; set; }

    public AppUser AppUser { get; set; } = default!;

    public FriendRequest? FriendRequest { get; set; }
    public int? FriendRequestId { get; set; }
    // public AppUserFriend? AppUserFriend { get; set; }
    /*public int NotificationTo { get; set; }
    public AppUser NotificationFrom { get; set; } = default!;*/
    public NotificationType Type { get; set; }
    public DateTime TimeCreated { get; set; }
    public NotificationStatus Status { get; set; }
}

public enum NotificationType
{
    Unknown,
    FriendRequest,
    Message,
    ProjectInvite
}

public enum NotificationStatus
{
    Unread,
    Read
}