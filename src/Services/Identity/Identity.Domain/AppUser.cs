using Infrastructure.Common;
using Infrastructure.Common.User;
using Microsoft.AspNetCore.Identity;

namespace Identity.Domain;

public class AppUser : IdentityUser<Guid>, IUser, IEntity
{
    public AppUser()
    {
        DisplayName = $"{FirstName} {LastName}";
    }

    public ICollection<AppUserRole> AppUserRoles { get; set; } = default!;
    public ICollection<AppUserLink> AppUserLinksRequested { get; set; } = default!;
    public ICollection<AppUserLink> AppUserLinksReceived { get; set; } = default!;
    public ICollection<Notification> NotificationsRequested { get; set; } = default!;
    public ICollection<Notification> NotificationsReceived { get; set; } = default!;
    public override string UserName { get; set; } = default!;
    public string FirstName { get; init; } = default!;
    public string LastName { get; init; } = default!;
    public string DisplayName { get; init; }
    public string PhotoUrl { get; set; } = default!;
    public DateTime LastActiveTime { get; set; } = DateTime.Now;
    public DateTime CreatedTime { get; set; } = DateTime.Now;
    public DateTime LastModifiedTime { get; set; } = DateTime.Now;

    public void UpdateModifiedProperties()
    {
        LastModifiedTime = DateTime.Now;
        LastActiveTime = DateTime.Now;
    }
}
