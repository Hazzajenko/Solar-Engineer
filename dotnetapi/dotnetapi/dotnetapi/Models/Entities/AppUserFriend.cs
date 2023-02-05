using System.ComponentModel.DataAnnotations.Schema;

namespace dotnetapi.Models.Entities;

public class AppUserFriendDto
{
    public int Id { get; set; }
    public string Type { get; set; }
    public DateTime RequestTime { get; set; }
    public NotificationStatus Status { get; set; }
    public string RequestedByUserName { get; set; } = default!;
    public string RequestedToUserName { get; set; } = default!;
    public DateTime? BecameFriendsTime { get; set; }
    public FriendRequestFlag FriendRequestFlag { get; set; }
}

public class AppUserFriend : NotificationBase /* : BaseEntity*/
{
    /*public int RequestedById { get; set; }
    public int RequestedToId { get; set; }

    public virtual AppUser RequestedBy { get; set; } = default!;
    public virtual AppUser RequestedTo { get; set; } = default!;*/

    // public DateTime? RequestTime { get; set; }

    public DateTime? BecameFriendsTime { get; set; }

    public FriendRequestFlag FriendRequestFlag { get; set; }

    /*public Notification Notification { get; set; } = default!;
    public int NotificationId { get; set; }*/

    [NotMapped] public bool Approved => FriendRequestFlag == FriendRequestFlag.Approved;

    /*
    public void AddFriendRequest(AppUser user, AppUser friendUser)
    {
        var friendRequest = new AppUserFriend
        {
            RequestedBy = user,
            RequestedTo = friendUser,
            RequestTime = DateTime.Now,
            FriendRequestFlag = FriendRequestFlag.None
        };
        user.SentFriendRequests.Add(friendRequest);
    }*/
}

public enum FriendRequestFlag
{
    None,
    Approved,
    Rejected,
    Blocked,
    Spam
}