using Infrastructure.Common;

namespace Messages.API.Entities;

public class User : SharedUser
{
    public ICollection<Message> MessagesSent { get; set; } = default!;
    public ICollection<Message> MessagesReceived { get; set; } = default!;
    public ICollection<UserGroupChat> UserGroupChats { get; set; } = default!;
    public ICollection<GroupChatMessage> GroupChatMessagesSent { get; set; } = default!;
}