namespace Messages.Contracts.Data;

public class GroupChatMessageDto
{
    public string Id { get; set; } = default!;
    public string GroupChatId { get; set; } = default!;
    public string SenderId { get; set; } = default!;
    public string SenderDisplayName { get; set; } = default!;
    public string Content { get; set; } = default!;
    public IEnumerable<GroupChatReadTimeDto> MessageReadTimes { get; set; } = default!;

    public DateTime MessageSentTime { get; set; } = DateTime.UtcNow;

    public EMessageFrom MessageFrom { get; set; } = EMessageFrom.Unknown;

    public bool SenderInGroup { get; set; } = true;
}