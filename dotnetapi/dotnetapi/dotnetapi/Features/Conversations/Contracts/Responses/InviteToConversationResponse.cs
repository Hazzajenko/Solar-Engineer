using dotnetapi.Features.Conversations.Entities;

namespace dotnetapi.Features.Conversations.Contracts.Responses;

public class InviteToConversationResponse
{
    public ConversationMemberDto Member { get; set; } = default!;
    /*[Required] public string Recipient { get; set; } = default!;
    public string Role { get; set; } = default!;*/
}