using dotnetapi.Features.GroupChats.Entities;
using dotnetapi.Features.Messages.Entities;

namespace dotnetapi.Features.GroupChats.Contracts.Responses;

public class ManyGroupChatsDataResponse
{
    public IEnumerable<GroupChatWithoutMembersDto> GroupChats { get; set; } = default!;
    public IEnumerable<GroupChatMemberDto> GroupChatMembers { get; set; } = default!;
    public IEnumerable<LastGroupChatMessageDto> GroupChatMessages { get; set; } = default!;
}