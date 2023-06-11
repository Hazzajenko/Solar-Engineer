namespace Identity.Contracts.Data;

public class NotificationDto
{
    public string Id { get; set; } = default!;
    public string AppUserId { get; set; } = default!;
    public string AppUserUserName { get; set; } = default!;
    public string SenderAppUserId { get; set; } = default!;
    public string SenderAppUserUserName { get; set; } = default!;
    public string SenderAppUserPhotoUrl { get; set; } = default!;
    public string Content { get; set; } = default!;
    public string NotificationType { get; set; } = default!;
    public DateTime Created { get; set; } = DateTime.Now;
    public bool SeenByAppUser { get; set; }
    public bool DeletedByAppUser { get; set; }
    public bool CancelledBySender { get; set; }
}
