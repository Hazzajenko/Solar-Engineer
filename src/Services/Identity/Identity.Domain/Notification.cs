using Ardalis.SmartEnum;
using Infrastructure.Common;

namespace Identity.Domain;

public class Notification : IEntity
{
    public Notification() { }

    public Notification(AppUser appUser, AppUser senderAppUser, NotificationType notificationType)
    {
        AppUserId = appUser.Id;
        SenderAppUserId = senderAppUser.Id;
        NotificationType = notificationType;
    }

    public Guid Id { get; set; }
    public Guid AppUserId { get; set; }
    public AppUser AppUser { get; set; } = default!;
    public Guid SenderAppUserId { get; set; }
    public AppUser SenderAppUser { get; set; } = default!;
    public NotificationType NotificationType { get; set; } = default!;

    public DateTime CreatedTime { get; set; } = DateTime.Now;
    public DateTime LastModifiedTime { get; set; } = DateTime.Now;

    public bool ReceivedByAppUser { get; set; }
    public bool SeenByAppUser { get; set; }
    public DateTime? SeenByAppUserTime { get; set; }
    public bool AppUserResponded { get; set; }
    public DateTime? AppUserRespondedTime { get; set; }
    public bool DeletedByAppUser { get; set; }
    public bool CancelledBySender { get; set; }

    public void SetReceivedByAppUser()
    {
        ReceivedByAppUser = true;
    }

    public void SetSeenByAppUser()
    {
        SeenByAppUser = true;
        SeenByAppUserTime = DateTime.Now;
    }

    public void SetAppUserResponded()
    {
        AppUserResponded = true;
        AppUserRespondedTime = DateTime.Now;
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
