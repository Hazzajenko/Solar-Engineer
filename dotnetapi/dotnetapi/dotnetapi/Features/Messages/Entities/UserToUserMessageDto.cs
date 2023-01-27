using dotnetapi.Models.Entities;

namespace dotnetapi.Features.Messages.Entities;

public class UserToUserMessageDto
{
    public int Id { get; set; }
    public string SenderUserName { get; set; } = default!;
    public string RecipientUserName { get; set; } = default!;
    public string Content { get; set; } = default!;
    public DateTime? MessageReadTime { get; set; }
    public DateTime MessageSentTime { get; set; } = DateTime.UtcNow;
    public NotificationStatus Status { get; set; }
}