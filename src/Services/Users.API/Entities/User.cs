namespace Users.API.Entities;

public class User
{
    public ICollection<UserLink> AppUserLinksRequested { get; set; } = default!;
    public ICollection<UserLink> AppUserLinksReceived { get; set; } = default!;
}
