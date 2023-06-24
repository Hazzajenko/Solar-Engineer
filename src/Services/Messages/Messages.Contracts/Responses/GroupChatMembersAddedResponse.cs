using Messages.Contracts.Data;

namespace Messages.Contracts.Responses;

public class GroupChatMembersAddedResponse
{
    public string GroupChatId { get; set; } = default!;
    public string InvitedByUserId { get; set; } = default!;
    public IEnumerable<InitialGroupChatMemberDto> Members { get; set; } = default!;
}