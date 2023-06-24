namespace Messages.Contracts.Data;

public class GroupChatReadTimeDto
{
    public string Id { get; set; } = default!;
    public string RecipientId { get; set; } = default!;
    public DateTime MessageReadTime { get; set; }
}