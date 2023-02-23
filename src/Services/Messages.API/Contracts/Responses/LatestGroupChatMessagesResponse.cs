using Messages.API.Contracts.Data;

namespace Messages.API.Contracts.Responses;

public class LatestGroupChatMessagesResponse
{
    public IEnumerable<GroupChatDto> GroupChats { get; set; } = new List<GroupChatDto>();
}