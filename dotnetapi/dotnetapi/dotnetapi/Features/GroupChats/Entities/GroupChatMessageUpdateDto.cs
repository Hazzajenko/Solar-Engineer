namespace dotnetapi.Features.GroupChats.Entities;

public class GroupChatMessageUpdateDto
{
    public int Id { get; set; }
    public GroupChatMessageChanges Changes { get; set; }
}

public class GroupChatMessageChanges
{
    public bool SenderInGroup { get; set; }
}