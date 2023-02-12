using Infrastructure.Common;

namespace Users.API.Entities;

public class UserLink : IEntity
{
    public Guid AppUserRequestedId { get; set; }
    public string AppUserRequestedDisplayName { get; set; } = default!;
    public string AppUserRequestedNickName { get; set; } = default!;
    public Guid AppUserReceivedId { get; set; }
    public string AppUserReceivedDisplayName { get; set; } = default!;
    public string AppUserReceivedNickName { get; set; } = default!;
    public DateTime? BecameFriendsTime { get; set; }
    public bool Friends { get; set; }
    public string AppUserRequestedStatusEvent { get; set; } = default!;
    public DateTime AppUserRequestedStatusTime { get; set; } = default!;
    public string AppUserReceivedStatusEvent { get; set; } = default!;
    public DateTime AppUserReceivedStatusTime { get; set; } = default!;
    public Guid Id { get; init; }
    public DateTime CreatedTime { get; set; }
    public DateTime LastModifiedTime { get; set; }
}