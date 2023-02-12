using Microsoft.AspNetCore.Identity;

namespace Infrastructure.Entities.Identity;

public class AppUser : IdentityUser<Guid>
{
    public AppUser()
    {
        DisplayName = $"{FirstName} {LastName}";
    }

    public string FirstName { get; init; } = default!;
    public string LastName { get; init; } = default!;
    public string DisplayName { get; init; }
    public string PhotoUrl { get; set; } = default!;
    public DateTime CreatedTime { get; set; } = DateTime.Now;
    public DateTime LastActiveTime { get; set; } = DateTime.Now;
    public ICollection<AppUserRole> AppUserRoles { get; set; } = default!;

    /*public ICollection<AppUserIdentity> AppUserIdentities { get; set; } = default!;
    public ICollection<Auth0User> Auth0Users { get; set; } = default!;
    public ICollection<AppUserLink> AppUserLinksSent { get; set; } = default!;
    public ICollection<AppUserLink> AppUserLinksReceived { get; set; } = default!;
    public ICollection<AppUserProject> AppUserProjects { get; set; } = default!;
    public ICollection<AppUserRole> AppUserRoles { get; set; } = default!;
    public ICollection<Notification> NotificationsReceived { get; set; } = default!;
    public ICollection<Notification> NotificationsSent { get; set; } = default!;
    public ICollection<Message> MessagesSent { get; set; } = default!;
    public ICollection<Message> MessagesReceived { get; set; } = default!;
    public ICollection<AppUserGroupChat> AppUserGroupChats { get; set; } = default!;
    public ICollection<GroupChatMessage> GroupChatMessagesSent { get; set; } = default!;*/
}