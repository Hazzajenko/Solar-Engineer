using Infrastructure.Common;
using Infrastructure.Entities.Identity;

namespace Users.API.Entities;

public class UserLink : IEntity<Guid>
{
    public UserLink(AppUser appUser, AppUser recipient)
    {
        AppUserRequestedId = appUser.Id;
        AppUserRequestedDisplayName = appUser.DisplayName;
        AppUserReceivedId = recipient.Id;
        AppUserReceivedDisplayName = recipient.DisplayName;
        CreatedTime = DateTime.Now;
    }

    public UserLink()
    {
    }

    public User AppUserRequested { get; set; }
    public Guid AppUserRequestedId { get; set; }
    public string AppUserRequestedDisplayName { get; set; } = default!;
    public string AppUserRequestedNickName { get; set; } = default!;
    public User AppUserReceived { get; set; }
    public Guid AppUserReceivedId { get; set; }
    public string AppUserReceivedDisplayName { get; set; } = default!;
    public string AppUserReceivedNickName { get; set; } = default!;
    public DateTime? BecameFriendsTime { get; set; }
    public bool Friends { get; set; }
    public string AppUserRequestedStatusEvent { get; set; } = default!;
    public DateTime AppUserRequestedStatusTime { get; set; }
    public string AppUserReceivedStatusEvent { get; set; } = default!;
    public DateTime AppUserReceivedStatusTime { get; set; }
    // public Guid Id { get; init; }
    // public DateTime CreatedTime { get; set; }
    // public DateTime LastModifiedTime { get; set; }
}