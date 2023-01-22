using dotnetapi.Features.Conversations.Entities;

namespace dotnetapi.Features.Conversations.Contracts.Responses;

public class CreateConversationResponse
{
    public ConversationDto Conversation { get; set; } = default!;
}