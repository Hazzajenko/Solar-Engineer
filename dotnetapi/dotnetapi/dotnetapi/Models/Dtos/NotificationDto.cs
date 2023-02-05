using dotnetapi.Models.Entities;

namespace dotnetapi.Models.Dtos;

public class NotificationDto
{
    public int Id { get; set; }
    public string Username { get; set; } = default!;
    public string Type { get; set; }
    public DateTime RequestTime { get; set; }

    public NotificationStatus Status { get; set; }

    // public T Request { get; set; } = default!;
    public FriendRequestDto? FriendRequest { get; set; }
}