using Messages.Contracts.Data;

namespace Messages.Contracts.Responses;

public class GroupChatMembersRemovedResponse
{
    public string GroupChatId { get; set; } = default!;
    public string RemovedByUserId { get; set; } = default!;
    public IEnumerable<string> MemberIds { get; set; } = default!;
}
