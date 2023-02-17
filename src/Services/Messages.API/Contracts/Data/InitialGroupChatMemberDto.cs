namespace Messages.API.Contracts.Data;

public class InitialGroupChatMemberDto
{
    public int Id { get; set; }
    public int GroupChatId { get; set; }
    public int UserId { get; set; }
    public string DisplayName { get; set; } = default!;
    public string Role { get; set; } = default!;
    public DateTime JoinedAt { get; set; } = default!;
}