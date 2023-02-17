// using Infrastructure.Entities.Identity;

using Infrastructure.Common;

namespace Messages.API.Entities;

public class Message : Entity
{
    public Guid SenderId { get; set; }
    public User Sender { get; set; } = default!;
    public Guid RecipientId { get; set; }
    public User Recipient { get; set; } = default!;
    public string Content { get; set; } = default!;
    public DateTime? MessageReadTime { get; set; }
    public DateTime MessageSentTime { get; set; } = DateTime.UtcNow;
    public bool SenderDeleted { get; set; }
    public bool RecipientDeleted { get; set; }
}