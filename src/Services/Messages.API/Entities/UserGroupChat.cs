using Infrastructure.Common;

namespace Messages.API.Entities;

public class UserGroupChat : Entity
{
    public Guid UserId { get; set; }
    public User User { get; set; } = default!;
    public Guid GroupChatId { get; set; }
    public GroupChat GroupChat { get; set; } = default!;
    public DateTime JoinedAt { get; set; }
    public string Role { get; set; } = default!;
    public bool CanInvite { get; set; }
    public bool CanKick { get; set; }
}