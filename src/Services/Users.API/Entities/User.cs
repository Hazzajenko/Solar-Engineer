using Infrastructure.Common;

namespace Users.API.Entities;

public class User : SharedUser
{
    public ICollection<UserLink> AppUserLinksRequested { get; set; } = default!;
    public ICollection<UserLink> AppUserLinksReceived { get; set; } = default!;
}