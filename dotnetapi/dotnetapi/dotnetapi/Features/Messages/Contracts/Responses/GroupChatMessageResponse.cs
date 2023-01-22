using dotnetapi.Features.Messages.Entities;

namespace dotnetapi.Features.Messages.Contracts.Responses;

public class GroupChatMessageResponse
{
    public GroupChatMessageDto Message { get; init; } = default!;
}