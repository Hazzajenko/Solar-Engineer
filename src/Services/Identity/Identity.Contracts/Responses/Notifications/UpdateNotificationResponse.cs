using Identity.Contracts.Data;

namespace Identity.Contracts.Responses.Notifications;

public class UpdateNotificationResponse
{
    public NotificationDto Notification { get; set; } = default!;
}
