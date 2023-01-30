using dotnetapi.Models.Entities;

namespace dotnetapi.Features.GroupChats.Entities;

public class GroupChatServerMessage : BaseEntity
{
    public int GroupChatId { get; set; } = default!;
    public GroupChat GroupChat { get; set; } = default!;
    public string Content { get; set; } = default!;
    public DateTime MessageSentTime { get; set; } = DateTime.UtcNow;
}

// public const Server() = "SERVER"

public class GroupChatServerMessageDto
{
    public int Id { get; set; }

    public int GroupChatId { get; set; }

    // public string SenderUserName { get; set; } = "SERVER";
    public string Content { get; set; } = default!;
    public DateTime MessageSentTime { get; set; } = DateTime.UtcNow;

    public MessageFrom MessageFrom { get; set; } = MessageFrom.Server;
    // public bool IsUserSender { get; set; } = false;
    // public bool IsServer { get; set; } = true;
}