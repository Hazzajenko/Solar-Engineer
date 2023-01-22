using dotnetapi.Features.Messages.Entities;

namespace dotnetapi.Features.GroupChats.Entities;

public class ManyGroupChatsDto
{
    public IEnumerable<GroupChatWithoutMembersDto> GroupChats { get; set; } = default!;
    public IEnumerable<GroupChatMemberDto> GroupChatMembers { get; set; } = default!;
    public IEnumerable<GroupChatMessageDto> GroupChatMessages { get; set; } = default!;
}