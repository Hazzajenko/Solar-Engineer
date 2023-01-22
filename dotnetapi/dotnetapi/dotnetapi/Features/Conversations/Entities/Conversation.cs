using dotnetapi.Models.Entities;

namespace dotnetapi.Features.Conversations.Entities;

public class Conversation : BaseEntity
{
    public string Name { get; set; } = default!;
    public ICollection<AppUserConversation> AppUserConversations { get; set; } = default!;
}