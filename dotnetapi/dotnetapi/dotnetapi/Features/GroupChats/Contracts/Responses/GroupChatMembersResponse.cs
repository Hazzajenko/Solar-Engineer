using dotnetapi.Features.GroupChats.Entities;

namespace dotnetapi.Features.GroupChats.Contracts.Responses;

public class GroupChatMembersResponse
{
    public IEnumerable<GroupChatMemberDto> Members { get; set; } = default!;
}