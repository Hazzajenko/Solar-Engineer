using Infrastructure.Common;

// using Infrastructure.Entities.Identity;

namespace Messages.API.Entities;

public class GroupChat : Entity
{
    public string Name { get; set; } = default!;
    public User CreatedBy { get; set; } = default!;
    public Guid CreatedById { get; set; }
    public DateTime Created { get; set; }
    public string PhotoUrl { get; set; } = default!;

    public ICollection<UserGroupChat> UserGroupChats { get; set; } = default!;
    public ICollection<GroupChatMessage> GroupChatMessages { get; set; } = default!;
    public ICollection<GroupChatServerMessage> GroupChatServerMessages { get; set; } = default!;
}