// using Infrastructure.Entities.Identity;

using Infrastructure.Common;

namespace Messages.Domain.Entities;

public class GroupChat : IEntity
{
    public string Name { get; set; } = default!;
    public Guid CreatedById { get; set; }
    public DateTime Created { get; set; }
    public string PhotoUrl { get; set; } = default!;

    public ICollection<AppUserGroupChat> AppUserGroupChats { get; set; } = default!;

    public ICollection<GroupChatMessage> GroupChatMessages { get; set; } = default!;

    // public ICollection<GroupChatServerMessage> GroupChatServerMessages { get; set; } = default!;
    public DateTime CreatedTime { get; set; }
    public DateTime LastModifiedTime { get; set; }
    public Guid Id { get; set; }
}
