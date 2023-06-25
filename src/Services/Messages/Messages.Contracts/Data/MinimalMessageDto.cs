namespace Messages.Contracts.Data;

public class MinimalMessageDto
{
    public string Id { get; set; } = default!;
    public string SenderId { get; set; } = default!;
    public string RecipientId { get; set; } = default!;
    public string OtherUserId { get; set; } = default!;
    public string Content { get; set; } = default!;
    public DateTime MessageSentTime { get; set; } = DateTime.UtcNow;
    public bool IsReadByUser { get; set; }
    public string MessageFrom { get; set; } = EMessageFrom.Unknown.Name;
    public bool IsUserSender { get; set; }
}
