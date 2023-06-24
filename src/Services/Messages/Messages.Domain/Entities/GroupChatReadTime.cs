
using Infrastructure.Common;

namespace Messages.Domain.Entities;

public class GroupChatReadTime : IEntity
{
    public Guid UserId { get; set; }
    public Guid GroupChatMessageId { get; set; }
    public GroupChatMessage GroupChatMessage { get; set; } = default!;
    public DateTime MessageReadTime { get; set; }
    public DateTime CreatedTime { get; set; }
    public DateTime LastModifiedTime { get; set; }
    public Guid Id { get; set; }
}