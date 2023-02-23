namespace Messages.API.Contracts.Data;

public class GroupChatDto
{
    public string Id { get; set; } = default!;
    public string Name { get; set; } = default!;
    public string PhotoUrl { get; set; } = default!;
    public IEnumerable<InitialGroupChatMemberDto> Members { get; set; } = new List<InitialGroupChatMemberDto>();
    public GroupChatCombinedMessageDto? LatestMessage { get; set; } = new();
}