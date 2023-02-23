namespace Messages.API.Contracts.Data;

public class InitialGroupChatMemberDto
{
    public string Id { get; set; }
    public string GroupChatId { get; set; }

    public string AppUserId { get; set; }

    // public string DisplayName { get; set; } = default!;
    public string Role { get; set; } = default!;
    public DateTime JoinedAt { get; set; } = default!;
}