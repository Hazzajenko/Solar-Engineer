namespace dotnetapi.Features.GroupChats.Entities;

public class GroupChatMessageDto
{
    public int Id { get; set; }
    public int GroupChatId { get; set; } = default!;
    public string SenderUserName { get; set; } = default!;
    public string Content { get; set; } = default!;
    public IEnumerable<GroupChatReadTimeDto> MessageReadTimes { get; set; } = default!;

    public DateTime MessageSentTime { get; set; } = DateTime.UtcNow;

    public bool IsUserSender { get; set; }
    // public NotificationStatus Status { get; set; }
}

public class GroupChatReadTimeDto
{
    public int Id { get; set; }
    public string RecipientUserName { get; set; } = default!;
    public DateTime MessageReadTime { get; set; }
}