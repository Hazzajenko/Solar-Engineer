using dotnetapi.Features.GroupChats.Entities;

namespace dotnetapi.Features.GroupChats.Contracts.Responses;

public class InviteManyToGroupChatResponse
{
    public IEnumerable<GroupChatMemberDto> NewMembers { get; set; } = default!;
}