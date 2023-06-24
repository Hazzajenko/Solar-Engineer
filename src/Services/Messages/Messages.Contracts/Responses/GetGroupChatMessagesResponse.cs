using Messages.Contracts.Data;

namespace Messages.Contracts.Responses;

public class GetGroupChatMessagesResponse
{
    public IEnumerable<GroupChatCombinedMessageDto> GroupChatMessages { get; set; } = default!;
}
