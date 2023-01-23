using dotnetapi.Features.GroupChats.Entities;
using dotnetapi.Models.Entities;

namespace dotnetapi.Features.Messages.Entities;

public class GroupChatMessage : BaseEntity
{
    // public int Id { get; set; }
    public int SenderId { get; set; } = default!;
    public AppUser Sender { get; set; } = default!;
    public int GroupChatId { get; set; } = default!;
    public GroupChat GroupChat { get; set; } = default!;
    public string Content { get; set; } = default!;
    public IEnumerable<GroupChatReadTime> MessageReadTimes { get; set; } = default!;
    public DateTime MessageSentTime { get; set; } = DateTime.UtcNow;
    public bool SenderDeleted { get; set; }
}

public class GroupChatReadTime : BaseEntity
{
    public int AppUserId { get; set; }
    public AppUser AppUser { get; set; } = default!;
    public DateTime MessageReadTime { get; set; }
}