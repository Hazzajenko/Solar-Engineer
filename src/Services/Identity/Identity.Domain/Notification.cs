using Ardalis.SmartEnum;
using Infrastructure.Common;

namespace Identity.Domain;

public class Notification : IEntity
{
    public Notification() { }

    public Notification(
        AppUser appUser,
        AppUser senderAppUser,
        NotificationType notificationType,
        string content
    )
    {
        AppUser = appUser;
        AppUserId = appUser.Id;
        AppUserUserName = appUser.UserName!;
        SenderAppUser = senderAppUser;
        SenderAppUserId = senderAppUser.Id;
        SenderAppUserUserName = senderAppUser.UserName!;
        NotificationType = notificationType;
        Content = content;
    }

    public Guid Id { get; set; }
    public Guid AppUserId { get; set; }
    public string AppUserUserName { get; set; } = default!;
    public AppUser AppUser { get; set; } = default!;
    public Guid SenderAppUserId { get; set; }
    public string SenderAppUserUserName { get; set; } = default!;
    public AppUser SenderAppUser { get; set; } = default!;
    public string Content { get; set; } = default!;
    public NotificationType NotificationType { get; set; } = default!;
    public DateTime CreatedTime { get; set; } = DateTime.Now;
    public DateTime LastModifiedTime { get; set; } = DateTime.Now;
    public bool SeenByAppUser { get; set; }
    public bool DeletedByAppUser { get; set; }
    public bool CancelledBySender { get; set; }

    public void SetSeenByAppUser()
    {
        SeenByAppUser = true;
    }
}

public sealed class NotificationType : SmartEnum<NotificationType>
{
    public static readonly NotificationType FriendRequestReceived =
        new(nameof(FriendRequestReceived), 1);
    public static readonly NotificationType FriendRequestAccepted =
        new(nameof(FriendRequestAccepted), 2);

    public static readonly NotificationType ProjectInviteReceived =
        new(nameof(ProjectInviteReceived), 3);
    public static readonly NotificationType ProjectInviteAccepted =
        new(nameof(ProjectInviteAccepted), 4);

    public static readonly NotificationType MessageReceived = new(nameof(MessageReceived), 5);

    private NotificationType(string name, int value)
        : base(name, value) { }
}

/*public static class NotificationType
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
}*/
