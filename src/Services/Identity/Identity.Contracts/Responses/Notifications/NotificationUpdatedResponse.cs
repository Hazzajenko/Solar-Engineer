namespace Identity.Contracts.Responses.Notifications;

public class NotificationUpdatedResponse
{
    public string NotificationId { get; set; } = default!;
    public string Event { get; set; } = default!;
}
