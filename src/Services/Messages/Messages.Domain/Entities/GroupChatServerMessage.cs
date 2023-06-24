using ApplicationCore.Interfaces;

namespace Messages.Domain.Entities;

public class GroupChatServerMessage : IEntity
{
    public Guid GroupChatId { get; set; } = default!;
    public GroupChat GroupChat { get; set; } = default!;
    public string Content { get; set; } = default!;
    public DateTime MessageSentTime { get; set; } = DateTime.UtcNow;
    public DateTime CreatedTime { get; set; }
    public DateTime LastModifiedTime { get; set; }
    public Guid Id { get; set; }
}
