using Infrastructure.Common;

namespace Messages.API.Entities;

public class GroupChatServerMessage : Entity
{
    public Guid GroupChatId { get; set; } = default!;
    public GroupChat GroupChat { get; set; } = default!;
    public string Content { get; set; } = default!;
    public DateTime MessageSentTime { get; set; } = DateTime.UtcNow;
}