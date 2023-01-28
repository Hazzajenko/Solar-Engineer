namespace dotnetapi.Features.GroupChats.Contracts.Requests;

public class CreateGroupChatRequest
{
    public string GroupChatName { get; set; } = default!;
    public IEnumerable<string> UserNamesToInvite { get; set; } = default!;
}