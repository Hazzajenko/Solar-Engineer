namespace Messages.API.Contracts.Data;

public class GroupChatMemberDto
{
    public int Id { get; set; }
    public int GroupChatId { get; set; }
    public int UserId { get; set; }
    public string DisplayName { get; set; } = default!;
    public string FirstName { get; init; } = default!;
    public string LastName { get; init; } = default!;
    public string PhotoUrl { get; init; } = default!;
    public DateTime LastActive { get; init; } = default!;
    public string Role { get; set; } = default!;
    public DateTime JoinedAt { get; set; } = default!;
}