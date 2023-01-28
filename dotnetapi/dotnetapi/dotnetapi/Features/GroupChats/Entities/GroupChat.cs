using dotnetapi.Features.Messages.Entities;
using dotnetapi.Models.Entities;

namespace dotnetapi.Features.GroupChats.Entities;

public class GroupChat : BaseEntity
{
    public string Name { get; set; } = default!;
    public AppUser CreatedBy { get; set; } = default!;
    public int CreatedById { get; set; } = default!;
    // public string CreatedByUserName { get; set; } = default!;
    public ICollection<AppUserGroupChat> AppUserGroupChats { get; set; } = default!;
    public ICollection<GroupChatMessage> GroupChatMessages { get; set; } = default!;
}