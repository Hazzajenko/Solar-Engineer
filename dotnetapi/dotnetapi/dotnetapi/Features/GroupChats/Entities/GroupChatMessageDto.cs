namespace dotnetapi.Features.GroupChats.Entities;

public class GroupChatMessageDto
{
    public int Id { get; set; }
    public int GroupChatId { get; set; }
    public int SenderId { get; set; }
    public string SenderDisplayName { get; set; } = default!;
    public string Content { get; set; } = default!;
    public IEnumerable<GroupChatReadTimeDto> MessageReadTimes { get; set; } = default!;

    public DateTime MessageSentTime { get; set; } = DateTime.UtcNow;

    public MessageFrom MessageFrom { get; set; } = MessageFrom.Unknown;

    public bool SenderInGroup { get; set; } = true;
    // public bool IsUserSender { get; set; }
    //
    // public bool IsServer { get; set; }
    // public NotificationStatus Status { get; set; }
}

public class GroupChatReadTimeDto
{
    public int Id { get; set; }
    public int RecipientId { get; set; }
    public string RecipientDisplayName { get; set; } = default!;
    public DateTime MessageReadTime { get; set; }
}