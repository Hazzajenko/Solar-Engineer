namespace Messages.Contracts.Data;

public class InitialGroupChatMemberDto
{
    public string Id { get; set; } = default!;
    public string GroupChatId { get; set; } = default!;

    public string AppUserId { get; set; } = default!;

    // public string DisplayName { get; set; } = default!;
    public string Role { get; set; } = default!;
    public DateTime JoinedAt { get; set; } = default!;
}