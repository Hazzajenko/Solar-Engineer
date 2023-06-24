namespace Messages.Contracts.Data;

public class GroupChatMessageUpdateDto
{
    public int Id { get; set; }
    public GroupChatMessageChanges Changes { get; set; } = default!;
}

public class GroupChatMessageChanges
{
    public bool SenderInGroup { get; set; }
}
