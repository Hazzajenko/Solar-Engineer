using Infrastructure.Common;

// using Infrastructure.Entities.Identity;

namespace Messages.API.Entities;

/*public class GroupChatMessage : Entity
{
    public Guid SenderId { get; set; }

    // public User Sender { get; set; } = default!;
    public Guid GroupChatId { get; set; }
    public GroupChat GroupChat { get; set; } = default!;
    public string Content { get; set; } = default!;
    public IEnumerable<GroupChatReadTime> MessageReadTimes { get; set; } = default!;
    public DateTime MessageSentTime { get; set; } = DateTime.UtcNow;
    public bool SenderInGroup { get; set; } = true;
    public bool SenderDeleted { get; set; }
}

public class GroupChatReadTime : Entity
{
    public Guid UserId { get; set; }

    // public User User { get; set; } = default!;
    public Guid GroupChatMessageId { get; set; }
    public GroupChatMessage GroupChatMessage { get; set; } = default!;
    public DateTime MessageReadTime { get; set; }
}*/
public class GroupChatReadTime : Entity
{
    public Guid UserId { get; set; }

    // public User User { get; set; } = default!;
    public Guid GroupChatMessageId { get; set; }
    public GroupChatMessage GroupChatMessage { get; set; } = default!;
    public DateTime MessageReadTime { get; set; }
}