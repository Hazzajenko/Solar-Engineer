namespace Messages.Contracts.Data;

public class GroupChatServerMessageDto
{
    public string Id { get; set; } = default!;

    public string GroupChatId { get; set; } = default!;

    // public string SenderUserName { get; set; } = "SERVER";
    public string Content { get; set; } = default!;
    public DateTime MessageSentTime { get; set; } = DateTime.UtcNow;

    public MessageFrom MessageFrom { get; set; } = MessageFrom.Server;
    // public bool IsUserSender { get; set; } = false;
    // public bool IsServer { get; set; } = true;
}