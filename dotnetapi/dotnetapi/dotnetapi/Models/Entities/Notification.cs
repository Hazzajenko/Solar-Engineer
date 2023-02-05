using ValueOf;

namespace dotnetapi.Models.Entities;

public class Notification : BaseEntity
{
    public Notification()
    {
    }

    public Notification(AppUser appUser, AppUser notificationFrom, string type, string content)
    {
        AppUser = appUser;
        AppUserId = appUser.Id;
        AppUserUserName = appUser.UserName!;
        NotificationFrom = notificationFrom;
        NotificationFromId = notificationFrom.Id;
        NotificationFromUserName = notificationFrom.UserName!;
        Type = type;
        Content = content;
        Created = DateTime.Now;
    }

    public int AppUserId { get; set; }
    public string AppUserUserName { get; set; } = default!;
    public AppUser AppUser { get; set; } = default!;
    public int NotificationFromId { get; set; }
    public string NotificationFromUserName { get; set; } = default!;
    public AppUser NotificationFrom { get; set; } = default!;
    public string Content { get; set; } = default!;

    // public NotificationType Type { get; set; }
    public string Type { get; set; }

    // public HttpTypes TypeTwo { get; set; }
    public DateTime Created { get; set; }
    public bool SeenByAppUser { get; set; }
    public bool DeletedByAppUser { get; set; }
    public bool CancelledBySender { get; set; }
}

/*
public enum NotificationType
{
    Unknown,
    FriendRequestSent,
    FriendRequestAccepted,
    FriendRequestRejected,
    Message,
    ProjectInviteSent,
    ProjectInviteAccepted
}*/

public static class NotificationType
{
    public const string Message = "MESSAGE";

    public static class FriendRequest
    {
        public const string Sent = "FRIEND_REQUEST_SENT";
        public const string Accepted = "FRIEND_REQUEST_ACCEPTED";
        public const string Rejected = "FRIEND_REQUEST_REJECTED";
    }

    public static class ProjectInvite
    {
        public const string Sent = "PROJECT_INVITE_SENT";
        public const string Accepted = "PROJECT_INVITE_ACCEPTED";
        public const string Rejected = "PROJECT_INVITE_REJECTED";
    }
}

// string hi = NotificationTypes.FriendRequest.Accepted;
// var hi = NotificationType.ProjectInviteSent.ToDisplayUpperSnakeCase();

public enum NotificationStatus
{
    Unread,
    Read
}

// var hi = NotificationType.ProjectInviteSent.DisplayName();

public static class HttpTypes
{
    public static readonly string FriendRequestSent = "FRIEND_REQUEST_SENT";
    public static readonly string FriendRequestAccepted = "FRIEND_REQUEST_ACCEPTED";
}

public class CustomerId : ValueOf<Guid, CustomerId>
{
    protected override void Validate()
    {
        if (Value == Guid.Empty)
            throw new ArgumentException("Customer Id cannot be empty", nameof(CustomerId));
    }
}