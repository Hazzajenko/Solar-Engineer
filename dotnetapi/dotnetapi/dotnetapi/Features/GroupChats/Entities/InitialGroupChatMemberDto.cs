namespace dotnetapi.Features.GroupChats.Entities;

public class InitialGroupChatMemberDto
{
    public int Id { get; set; }
    public int GroupChatId { get; set; }
    public string UserName { get; set; } = default!;
    public string Role { get; set; } = default!;
    public DateTime JoinedAt { get; set; } = default!;
}