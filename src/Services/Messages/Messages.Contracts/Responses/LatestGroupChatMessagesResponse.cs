using Messages.Contracts.Data;

namespace Messages.Contracts.Responses;

public class LatestGroupChatMessagesResponse
{
    public IEnumerable<GroupChatDto> GroupChats { get; set; } = new List<GroupChatDto>();
}