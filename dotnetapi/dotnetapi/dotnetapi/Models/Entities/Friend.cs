namespace dotnetapi.Models.Entities;

/*
public class Friend : BaseEntity
{
    [Key] [Column(Order = 0)] public int RequestedById { get; set; }

    [Key] [Column(Order = 1)] public int RequestedToId { get; set; }

    public AppUser RequestedBy { get; set; } = default!;
    public AppUser RequestedTo { get; set; } = default!;

    public DateTime? RequestTime { get; set; }

    public DateTime? BecameFriendsTime { get; set; }

    public FriendRequestFlag FriendRequestFlag { get; set; }

    [NotMapped] public bool Approved => FriendRequestFlag == FriendRequestFlag.Approved;

    public void AddFriendRequest(AppUser user, AppUser friendUser)
    {
        var friendRequest = new Friend
        {
            RequestedBy = user,
            RequestedTo = friendUser,
            RequestTime = DateTime.Now,
            FriendRequestFlag = FriendRequestFlag.None
        };
        user.SentFriendRequests.Add(friendRequest);
    }
}*/