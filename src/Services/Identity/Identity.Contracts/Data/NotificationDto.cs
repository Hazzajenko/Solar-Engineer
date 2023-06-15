using Identity.Domain;

namespace Identity.Contracts.Data;

public class NotificationDto
{
    public string Id { get; set; } = default!;
    public string SenderAppUserId { get; set; } = default!;
    public string SenderAppUserUserName { get; set; } = default!;
    public string SenderAppUserDisplayName { get; set; } = default!;
    public string SenderAppUserPhotoUrl { get; set; } = default!;
    public string NotificationType { get; set; } = default!;
    public DateTime CreatedTime { get; set; } = default!;
    public bool ReceivedByAppUser { get; set; }
    public bool SeenByAppUser { get; set; }
    public bool DeletedByAppUser { get; set; }
    public bool CancelledBySender { get; set; }
    public bool Completed { get; set; }
    public string? ProjectId { get; set; }
    public ProjectInvite? ProjectInvite { get; set; }
}
