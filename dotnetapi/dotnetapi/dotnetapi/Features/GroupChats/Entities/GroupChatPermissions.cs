namespace dotnetapi.Features.GroupChats.Entities;

public class GroupChatPermissions
{
    public bool CanInvite { get; set; } = true;
    public bool CanKick { get; set; } = false;
}