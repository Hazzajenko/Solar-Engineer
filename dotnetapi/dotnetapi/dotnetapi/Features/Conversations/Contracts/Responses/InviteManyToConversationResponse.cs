using dotnetapi.Features.Conversations.Entities;

namespace dotnetapi.Features.Conversations.Contracts.Responses;

public class InviteManyToConversationResponse
{
    public IEnumerable<ConversationMemberDto> NewMembers { get; set; } = default!;
}