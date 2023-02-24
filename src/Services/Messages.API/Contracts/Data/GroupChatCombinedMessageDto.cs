namespace Messages.API.Contracts.Data;

public class GroupChatCombinedMessageDto
{
    public string Id { get; set; } = default!;
    public string GroupChatId { get; set; } = default!;
    public string SenderId { get; set; } = default!;
    public string Content { get; set; } = default!;
    public IEnumerable<GroupChatReadTimeDto> MessageReadTimes { get; set; } = default!;
    public DateTime MessageSentTime { get; set; } = DateTime.UtcNow;
    public MessageFrom MessageFrom { get; set; } = MessageFrom.Unknown;
    public bool SenderInGroup { get; set; } = true;
    public bool ServerMessage { get; set; }
}