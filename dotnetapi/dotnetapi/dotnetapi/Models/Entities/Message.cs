namespace dotnetapi.Models.Entities;

public class Message
{
    public int Id { get; set; }
    public int SenderId { get; set; }
    public string SenderUsername { get; set; } = default!;
    public AppUser Sender { get; set; } = default!;
    public int RecipientId { get; set; }
    public string RecipientUsername { get; set; } = default!;
    public AppUser Recipient { get; set; } = default!;
    public string Content { get; set; } = default!;
    public DateTime? DateRead { get; set; }
    public DateTime MessageSent { get; set; } = DateTime.UtcNow;
    public bool SenderDeleted { get; set; }
    public bool RecipientDeleted { get; set; }
}