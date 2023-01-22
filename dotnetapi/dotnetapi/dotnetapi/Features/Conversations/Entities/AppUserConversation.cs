using dotnetapi.Models.Entities;

namespace dotnetapi.Features.Conversations.Entities;

public class AppUserConversation : BaseEntity
{
    public int AppUserId { get; set; }
    public AppUser AppUser { get; set; } = default!;
    public int ConversationId { get; set; }
    public Conversation Conversation { get; set; } = default!;
    public DateTime JoinedAt { get; set; }
    public string Role { get; set; } = default!;
    public bool CanInvite { get; set; }
    public bool CanKick { get; set; }
}