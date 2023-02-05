using dotnetapi.Features.Notifications.Data;

namespace dotnetapi.Features.Notifications.Contracts.Responses;

public class AllNotificationsResponse
{
    public IEnumerable<NotificationDto> Notifications { get; set; } = new List<NotificationDto>();
}