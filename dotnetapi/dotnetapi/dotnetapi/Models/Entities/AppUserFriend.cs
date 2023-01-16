using System.ComponentModel.DataAnnotations.Schema;

namespace dotnetapi.Models.Entities;

public class AppUserFriend : BaseEntity
{
    public int RequestedById { get; set; }
    public int RequestedToId { get; set; }

    public virtual AppUser RequestedBy { get; set; } = default!;
    public virtual AppUser RequestedTo { get; set; } = default!;

    public DateTime? RequestTime { get; set; }

    public DateTime? BecameFriendsTime { get; set; }

    public FriendRequestFlag FriendRequestFlag { get; set; }

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