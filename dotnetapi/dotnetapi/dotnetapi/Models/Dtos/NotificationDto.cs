using dotnetapi.Models.Entities;

namespace dotnetapi.Models.Dtos;

public class NotificationDto<T>
{
    public string Username { get; set; } = default!;
    public NotificationType Type { get; set; }
    public DateTime TimeCreated { get; set; }
    public NotificationStatus Status { get; set; }
    public T Notification { get; set; } = default!;
}