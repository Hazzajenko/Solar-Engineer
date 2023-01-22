using dotnetapi.Models.Entities;

namespace dotnetapi.Features.GroupChats.Entities;

public class AppUserGroupChat : BaseEntity
{
    public int AppUserId { get; set; }
    public AppUser AppUser { get; set; } = default!;
    public int GroupChatId { get; set; }
    public GroupChat GroupChat { get; set; } = default!;
    public DateTime JoinedAt { get; set; }
    public string Role { get; set; } = default!;
    public bool CanInvite { get; set; }
    public bool CanKick { get; set; }
}