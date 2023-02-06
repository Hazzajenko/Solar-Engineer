namespace dotnetapi.Models.Entities;

public class AppUserLink : BaseEntity
{
    public AppUser AppUserRequested { get; set; } = default!;
    public int AppUserRequestedId { get; set; }
    public string AppUserRequestedUserName { get; set; } = default!;
    public string AppUserRequestedNickName { get; set; } = default!;
    public AppUser AppUserReceived { get; set; } = default!;
    public int AppUserReceivedId { get; set; }
    public string AppUserReceivedUserName { get; set; } = default!;
    public string AppUserReceivedNickName { get; set; } = default!;
    public DateTime Created { get; set; } = DateTime.Now;

    // public ICollection<AppUserMessage> Messages { get; set; } = default!;
    public DateTime? BecameFriendsTime { get; set; }
    public bool Friends { get; set; }
    public UserToUserStatus UserToUserStatus { get; set; }
    public string AppUserRequestedStatusEvent { get; set; } = default!;
    public DateTime AppUserRequestedStatusDate { get; set; } = default!;

    public string AppUserReceivedStatusEvent { get; set; } = default!;

    public DateTime AppUserReceivedStatusDate { get; set; } = default!;
    // public bool LatestSeenByAppUser { get; set; }
}

public enum UserToUserStatus
{
    None,
    Pending,
    Approved,
    Rejected,
    Blocked
}

public static class UserStatus
{
    public static class FriendRequestSent
    {
        public const string Pending = "SENT_FRIEND_REQUEST_PENDING";
        public const string Accepted = "SENT_FRIEND_REQUEST_ACCEPTED";
        public const string Rejected = "SENT_FRIEND_REQUEST_REJECTED";
    }

    public static class FriendRequestReceived
    {
        public const string Pending = "RECEIVED_FRIEND_REQUEST_PENDING";
        public const string Accepted = "RECEIVED_FRIEND_REQUEST_ACCEPTED";
        public const string Rejected = "RECEIVED_FRIEND_REQUEST_REJECTED";
    }
}