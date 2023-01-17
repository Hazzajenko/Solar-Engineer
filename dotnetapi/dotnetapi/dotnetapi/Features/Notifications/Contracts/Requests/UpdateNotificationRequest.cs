using System.ComponentModel.DataAnnotations;
using dotnetapi.Models.Entities;

namespace dotnetapi.Features.Notifications.Contracts.Requests;

public class UpdateNotificationRequest
{
    [Required] public int Id { get; set; } = default!;

    [Required] public UpdateNotification Changes { get; set; } = default!;
}

public class UpdateNotification
{
    public NotificationStatus? Status { get; set; }
}