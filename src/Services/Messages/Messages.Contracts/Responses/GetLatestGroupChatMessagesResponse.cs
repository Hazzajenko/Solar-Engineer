using Messages.Contracts.Data;

namespace Messages.Contracts.Responses;

public class GetLatestGroupChatMessagesResponse
{
    public IEnumerable<GroupChatDto> GroupChats { get; set; } = default!;
}
