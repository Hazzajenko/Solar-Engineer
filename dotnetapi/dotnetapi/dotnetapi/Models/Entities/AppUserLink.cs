namespace dotnetapi.Models.Entities;

public class AppUserLink : BaseEntity
{
    public AppUser AppUserRequested { get; set; } = default!;
    public int AppUserRequestedId { get; set; } = default!;
    public string AppUserRequestedUserName { get; set; } = default!;
    public string AppUserRequestedNickName { get; set; } = default!;
    public AppUser AppUserReceived { get; set; } = default!;
    public int AppUserReceivedId { get; set; } = default!;
    public string AppUserReceivedUserName { get; set; } = default!;
    public string AppUserReceivedNickName { get; set; } = default!;
    public DateTime Created { get; set; } = DateTime.Now;

    // public ICollection<AppUserMessage> Messages { get; set; } = default!;
    public DateTime? BecameFriendsTime { get; set; }
    public bool Friends { get; set; }
    public UserToUserStatus UserToUserStatus { get; set; }
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