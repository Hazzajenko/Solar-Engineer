using Identity.Contracts.Data;
using Identity.Domain;

namespace Identity.Contracts.Responses.Notifications;

public class ReceiveAppUserNotificationsResponse
{
    public IEnumerable<NotificationDto> Notifications { get; set; } = new List<NotificationDto>();
}
