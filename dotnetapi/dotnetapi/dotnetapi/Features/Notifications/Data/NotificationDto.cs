using dotnetapi.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace dotnetapi.Features.Notifications.Data;

public class NotificationDto
{
    public int Id { get; set; }
    public int AppUserId { get; set; }
    public string AppUserUserName { get; set; } = default!;
    public int NotificationFromId { get; set; }
    public string NotificationFromUserName { get; set; } = default!;
    public string Content { get; set; } = default!;
    public string Type { get; set; }
    public DateTime Created { get; set; }
    public bool SeenByAppUser { get; set; }
    public bool DeletedByAppUser { get; set; }
    public bool CancelledBySender { get; set; }
}

public static class NotificationsMapper
{
    public static NotificationDto ToDto(this Notification request)
    {
        return new NotificationDto
        {
            Id = request.Id,
            AppUserId = request.AppUserId,
            AppUserUserName = request.AppUserUserName,
            NotificationFromId = request.NotificationFromId,
            NotificationFromUserName = request.NotificationFromUserName,
            Content = request.Content,
            Type = request.Type,
            Created = request.Created,
            SeenByAppUser = request.SeenByAppUser,
            DeletedByAppUser = request.DeletedByAppUser,
            CancelledBySender = request.CancelledBySender
        };
    }

    public static IEnumerable<NotificationDto> ToListDto(this IEnumerable<Notification> request)
    {
        return request.Select(x => x.ToDto());
    }

    public static Task<List<NotificationDto>> ProjectToDtoListAsync(
        this IQueryable<Notification> query
    )
    {
        return query.Select(x => x.ToDto()).ToListAsync();
    }
}