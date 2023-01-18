using dotnetapi.Models.Dtos;

namespace dotnetapi.Contracts.Responses.Users;

public class AllNotificationsResponse
{
    public IEnumerable<NotificationDto> Notifications { get; set; } =
        new List<NotificationDto>();
}