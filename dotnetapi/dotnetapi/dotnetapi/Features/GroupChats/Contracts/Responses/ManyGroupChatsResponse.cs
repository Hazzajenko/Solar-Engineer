using dotnetapi.Features.GroupChats.Entities;

namespace dotnetapi.Features.GroupChats.Contracts.Responses;

public class ManyGroupChatsResponse
{
    public IEnumerable<GroupChatDto> GroupChats { get; set; } = default!;
}