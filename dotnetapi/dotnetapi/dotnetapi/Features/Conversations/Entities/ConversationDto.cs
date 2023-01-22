namespace dotnetapi.Features.Conversations.Entities;

public class ConversationDto
{
    public int Id { get; set; }
    public string Name { get; set; } = default!;
    public IEnumerable<ConversationMemberDto> Members { get; set; } = default!;
}