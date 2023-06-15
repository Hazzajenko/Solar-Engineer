using Identity.Contracts.Data;

namespace Identity.Contracts.Responses.Notifications;

public class ReceiveNotificationResponse
{
    public NotificationDto Notification { get; set; } = default!;
}
