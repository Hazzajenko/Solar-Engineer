using dotnetapi.Features.GroupChats.Entities;

namespace dotnetapi.Features.Messages.Contracts.Responses;

public class GroupChatManyMessagesResponse
{
    public int GroupChatId { get; set; }
    public IEnumerable<GroupChatMessageDto> Messages { get; init; } = default!;
}