namespace dotnetapi.Models.Entities;

public class NotificationBase : BaseEntity
{
    /*public int AppUserId { get; set; }
    public AppUser AppUser { get; set; } = default!;*/
    public int RequestedById { get; set; }
    public int RequestedToId { get; set; }

    public virtual AppUser RequestedBy { get; set; } = default!;
    public virtual AppUser RequestedTo { get; set; } = default!;
    public string Type { get; set; }
    public DateTime RequestTime { get; set; }
    public NotificationStatus Status { get; set; }
}