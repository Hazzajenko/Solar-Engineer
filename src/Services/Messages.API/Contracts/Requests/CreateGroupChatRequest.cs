namespace Messages.API.Contracts.Requests;

public class CreateGroupChatRequest
{
    public string GroupChatName { get; set; } = default!;
    public IEnumerable<UserInvite> Invites { get; set; } = default!;
}