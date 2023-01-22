namespace dotnetapi.Features.Messages.Entities;

public class GroupChatMessageDto
{
    public int Id { get; set; }
    public int GroupChatId { get; set; } = default!;
    public string SenderUsername { get; set; } = default!;
    public string Content { get; set; } = default!;
    public IEnumerable<GroupChatReadTimeDto> MessageReadTimes { get; set; } = default!;

    public DateTime MessageSentTime { get; set; } = DateTime.UtcNow;
    // public NotificationStatus Status { get; set; }
}

public class GroupChatReadTimeDto
{
    public int Id { get; set; }
    public string RecipientUsername { get; set; } = default!;
    public DateTime MessageReadTime { get; set; }
}