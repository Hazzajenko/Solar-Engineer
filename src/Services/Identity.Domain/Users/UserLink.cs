using Identity.Domain.Auth;
using Infrastructure.Common;

// using Infrastructure.Entities.Identity;

namespace Identity.Domain.Users;

public class UserLink : IEntityToEntity
{
    public UserLink(AppUser appUser, AppUser recipient)
    {
        AppUserRequested = appUser;
        AppUserRequestedId = appUser.Id;
        AppUserRequestedDisplayName = appUser.DisplayName;
        AppUserReceived = recipient;
        AppUserReceivedId = recipient.Id;
        AppUserReceivedDisplayName = recipient.DisplayName;
        CreatedTime = DateTime.Now;
    }

    public UserLink()
    {
    }

    public AppUser AppUserRequested { get; set; } = default!;
    public Guid AppUserRequestedId { get; set; }
    public string AppUserRequestedDisplayName { get; set; } = default!;
    public AppUser AppUserReceived { get; set; } = default!;
    public Guid AppUserReceivedId { get; set; }
    public string AppUserReceivedDisplayName { get; set; } = default!;
    public DateTime? BecameFriendsTime { get; set; }
    public bool Friends { get; set; }
    public string AppUserRequestedStatusEvent { get; set; } = default!;
    public DateTime AppUserRequestedStatusTime { get; set; }
    public string AppUserReceivedStatusEvent { get; set; } = default!;
    public DateTime AppUserReceivedStatusTime { get; set; }
    public DateTime CreatedTime { get; set; }
    public DateTime LastModifiedTime { get; set; }

    public void BecomeFriends()
    {
        Friends = true;
        BecameFriendsTime = DateTime.Now;
    }

    public void SetAppUserRequestedStatus(string statusEvent)
    {
        AppUserRequestedStatusEvent = statusEvent;
        AppUserRequestedStatusTime = DateTime.Now;
    }

    public void SetAppUserReceivedStatus(string statusEvent)
    {
        AppUserReceivedStatusEvent = statusEvent;
        AppUserReceivedStatusTime = DateTime.Now;
    }

    public static UserLink Create(AppUser appUser, AppUser recipient)
    {
        var userLink = new UserLink(appUser, recipient);
        return userLink;
    }
}