using dotnetapi.Models.Entities;

namespace dotnetapi.Features.GroupChats.Entities;

public class GroupChatServerMessage : BaseEntity
{
    public int GroupChatId { get; set; } = default!;
    public GroupChat GroupChat { get; set; } = default!;
    public string Content { get; set; } = default!;
    public DateTime MessageSentTime { get; set; } = DateTime.UtcNow;
}

public class GroupChatServerMessageDto
{
    public int Id { get; set; }
    public int GroupChatId { get; set; } = default!;
    public string Content { get; set; } = default!;
    public DateTime MessageSentTime { get; set; } = DateTime.UtcNow;
}