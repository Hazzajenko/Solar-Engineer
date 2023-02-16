using Infrastructure.Common;

namespace Users.API.Entities;

public class User : CopyEntity<Guid>, IUser
{
    public ICollection<UserLink> AppUserLinksRequested { get; set; } = default!;
    public ICollection<UserLink> AppUserLinksReceived { get; set; } = default!;
    public string FirstName { get; init; } = default!;
    public string LastName { get; init; } = default!;
    public string DisplayName { get; init; } = default!;
    public string PhotoUrl { get; set; } = default!;
    public DateTime LastActiveTime { get; set; } = DateTime.Now;
}