using dotnetapi.Models.Entities;

namespace dotnetapi.Models.SignalR;

public class AppUserConnection
{
    public int Id { get; set; }
    public int AppUserId { get; set; }
    public AppUser AppUser { get; set; } = default!;
    public string ConnectionId { get; set; } = default!;
}