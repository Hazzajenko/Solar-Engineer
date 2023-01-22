using dotnetapi.Features.Conversations.Entities;

namespace dotnetapi.Features.Conversations.Contracts.Responses;

public class ConversationMembersResponse
{
    public IEnumerable<ConversationMemberDto> Members { get; set; } = default!;
}