namespace dotnetapi.Features.GroupChats.Entities;

public class GroupChatMessageSort
{
    public int Id { get; set; }
    public MessageType MessageType { get; set; } = default!;
    public DateTime MessageSentTime { get; set; } = DateTime.UtcNow;
}

public enum MessageType
{
    Message,
    ServerMessage
}