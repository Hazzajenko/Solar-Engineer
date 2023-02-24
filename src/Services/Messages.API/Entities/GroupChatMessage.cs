using Infrastructure.Common;

namespace Messages.API.Entities;

public class GroupChatMessage : Entity
{
    public Guid SenderId { get; set; }
    public Guid GroupChatId { get; set; }
    public GroupChat GroupChat { get; set; } = default!;
    public string Content { get; set; } = default!;
    public IEnumerable<GroupChatReadTime> MessageReadTimes { get; set; } = new List<GroupChatReadTime>();
    public DateTime MessageSentTime { get; set; } = DateTime.UtcNow;
    public bool SenderInGroup { get; set; } = true;
    public bool SenderDeleted { get; set; }
    public bool ServerMessage { get; set; }
}