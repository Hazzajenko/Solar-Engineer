namespace Messages.Contracts.Data;

public class GroupChatServerMessageDto
{
    public string Id { get; set; } = default!;

    public string GroupChatId { get; set; } = default!;
    public string Content { get; set; } = default!;
    public DateTime MessageSentTime { get; set; } = DateTime.UtcNow;

    public MessageFrom MessageFrom { get; set; } = MessageFrom.Server;
}
