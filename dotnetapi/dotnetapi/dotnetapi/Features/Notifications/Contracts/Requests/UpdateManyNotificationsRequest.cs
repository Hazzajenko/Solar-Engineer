using System.ComponentModel.DataAnnotations;

namespace dotnetapi.Features.Notifications.Contracts.Requests;

public class UpdateManyNotificationsRequest
{
    [Required]
    public IEnumerable<UpdateNotificationRequest> Updates { get; init; } =
        Enumerable.Empty<UpdateNotificationRequest>();
}