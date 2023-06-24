using ApplicationCore.Interfaces;
using Ardalis.SmartEnum;

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

    public Notification(
        AppUser appUser,
        AppUser senderAppUser,
        NotificationType notificationType,
        ProjectInvite? projectInvite = null
    )
    {
        AppUserId = appUser.Id;
        SenderAppUserId = senderAppUser.Id;
        NotificationType = notificationType;
        ProjectInvite = projectInvite;
        ProjectId = projectInvite?.ProjectId;
    }

    public Guid Id { get; set; }
    public Guid AppUserId { get; set; }
    public AppUser AppUser { get; set; } = default!;
    public Guid SenderAppUserId { get; set; }
    public AppUser SenderAppUser { get; set; } = default!;
    public NotificationType NotificationType { get; set; } = default!;

    public DateTime CreatedTime { get; set; } = DateTime.UtcNow;
    public DateTime LastModifiedTime { get; set; } = DateTime.UtcNow;

    public ProjectInvite? ProjectInvite { get; set; }
    public Guid? ProjectId { get; set; }

    public bool ReceivedByAppUser { get; set; }
    public bool SeenByAppUser { get; set; }
    public DateTime? SeenByAppUserTime { get; set; }
    public bool Completed { get; set; }
    public DateTime? CompletedTime { get; set; }
    public bool DeletedByAppUser { get; set; }
    public bool CancelledBySender { get; set; }

    public void SetReceivedByAppUser()
    {
        ReceivedByAppUser = true;
    }

    public void SetSeenByAppUser()
    {
        SeenByAppUser = true;
        SeenByAppUserTime = DateTime.UtcNow;
    }

    public void SetNotificationCompleted()
    {
        Completed = true;
        CompletedTime = DateTime.UtcNow;
        SetSeenByAppUser();
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

public class ProjectInvite
{
    public ProjectInvite() { }

    public ProjectInvite(Guid projectId, string projectName, string projectPhotoUrl)
    {
        ProjectId = projectId;
        ProjectName = projectName;
        ProjectPhotoUrl = projectPhotoUrl;
    }

    public Guid ProjectId { get; set; }
    public string ProjectName { get; set; } = default!;
    public string ProjectPhotoUrl { get; set; } = default!;
}

/*public class ProjectData
{
    public Guid ProjectId { get; set; }
    public string ProjectName { get; set; } = default!;
    public string ProjectPhotoUrl { get; set; } = default!;
}*/

/*
public class ProjectInviteReceivedNotification : Notification
{
    public ProjectInviteReceivedNotification() { }

    public ProjectInviteReceivedNotification(
        AppUser appUser,
        AppUser senderAppUser,
        ProjectData projectData
    )
        : base(appUser, senderAppUser, NotificationType.ProjectInviteReceived)
    {
        ProjectInvite = new ProjectInvite(nameof(ProjectInviteReceivedNotification), projectData);
        ProjectId = projectData.ProjectId;
    }

    public new ProjectInvite ProjectInvite { get; set; } = default!;
    public new Guid ProjectId { get; set; }
}

public class ProjectInviteAcceptedNotification : Notification
{
    public ProjectInviteAcceptedNotification() { }

    public ProjectInviteAcceptedNotification(
        AppUser appUser,
        AppUser senderAppUser,
        ProjectData projectData
    )
        : base(appUser, senderAppUser, NotificationType.ProjectInviteAccepted)
    {
        ProjectInvite = new ProjectInvite(nameof(ProjectInviteAcceptedNotification), projectData);
        ProjectId = projectData.ProjectId;
    }

    public new ProjectInvite ProjectInvite { get; set; } = default!;
    public new Guid ProjectId { get; set; }
}
*/
