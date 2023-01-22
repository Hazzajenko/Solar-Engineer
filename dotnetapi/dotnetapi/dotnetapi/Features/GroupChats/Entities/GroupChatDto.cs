namespace dotnetapi.Features.GroupChats.Entities;

public class GroupChatDto
{
    public int Id { get; set; }
    public string Name { get; set; } = default!;
    public IEnumerable<GroupChatMemberDto> Members { get; set; } = default!;
}

public class GroupChatWithoutMembersDto
{
    public int Id { get; set; }
    public string Name { get; set; } = default!;
}