using dotnetapi.Models.Dtos;

namespace dotnetapi.Features.Conversations.Entities;

public class ConversationMemberDto : AppUserDto
{
    public string Role { get; set; } = default!;
    public DateTime JoinedConversationAt { get; set; } = default!;
}