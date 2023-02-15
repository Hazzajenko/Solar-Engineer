using Infrastructure.Common;
using Infrastructure.Entities.Identity;
using Microsoft.AspNetCore.Identity;

namespace Users.API.Entities;

public class User : IEntity<Guid>
{
    public string FirstName { get; init; } = default!;
    public string LastName { get; init; } = default!;
    public string DisplayName { get; init; } = default!;
    public string PhotoUrl { get; set; } = default!;
    public DateTime LastActiveTime { get; set; } = DateTime.Now;
    public ICollection<UserLink> AppUserLinksRequested { get; set; } = default!;
    public ICollection<UserLink> AppUserLinksReceived { get; set; } = default!;
}