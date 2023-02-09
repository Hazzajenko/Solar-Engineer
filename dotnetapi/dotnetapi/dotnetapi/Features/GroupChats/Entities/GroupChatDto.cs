namespace dotnetapi.Features.GroupChats.Entities;

public class GroupChatDto
{
    public int Id { get; set; }
    public string Name { get; set; } = default!;
    public string PhotoUrl { get; set; } = default!;
    public DateTime Created { get; set; }
    public IEnumerable<GroupChatMemberDto> Members { get; set; } = default!;
    public IEnumerable<GroupChatServerMessageDto> ServerMessages { get; set; } = default!;
}

public class InitialGroupChatDto
{
    public int Id { get; set; }
    public string Name { get; set; } = default!;
    public string PhotoUrl { get; set; } = default!;
    public DateTime Created { get; set; }
    public IEnumerable<InitialGroupChatMemberDto> Members { get; set; } = default!;
    public IEnumerable<GroupChatServerMessageDto> ServerMessages { get; set; } = default!;
}

public class GroupChatWithoutMembersDto
{
    public int Id { get; set; }
    public string Name { get; set; } = default!;
    public string PhotoUrl { get; set; } = default!;
    public DateTime Created { get; set; }
}

/*public class GroupChatCombined
{
    public int Id { get; set; }
    public string Name { get; set; } = default!;
    public string PhotoUrl { get; set; } = default!;
    public int CreatedById { get; set; } = default!;
    public DateTime Created { get; set; }
    public IEnumerable<GroupChatMember> Messages { get; set; } = default!;
    public IEnumerable<GroupChatMember> Members { get; set; } = default!;
    public IEnumerable<GroupChatServerMessage> ServerMessages { get; set; } = default!;
}*/

public class GroupChatCombinedDto
{
    public int Id { get; set; }
    public string Name { get; set; } = default!;
    public string PhotoUrl { get; set; } = default!;
    public int CreatedById { get; set; } = default!;
    public string CreatedByDisplayName { get; set; } = default!;
    public DateTime Created { get; set; }
    public IEnumerable<GroupChatMessageDto> Messages { get; set; } = default!;
    public IEnumerable<GroupChatMemberDto> Members { get; set; } = default!;
    public IEnumerable<GroupChatServerMessageDto> ServerMessages { get; set; } = default!;
}

public class InitialGroupChatCombinedDto
{
    public int Id { get; set; }
    public string Name { get; set; } = default!;
    public string PhotoUrl { get; set; } = default!;
    public GroupChatPermissions Permissions { get; set; } = new();
    public IEnumerable<InitialGroupChatMemberDto> Members { get; set; } = default!;
    public GroupChatMessageDto? LatestMessage { get; set; } = default!;
    public GroupChatServerMessageDto? LatestServerMessage { get; set; } = default!;
}