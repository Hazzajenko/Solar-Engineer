using Microsoft.AspNetCore.Identity;

namespace Identity.API.Entities;

public class AppUser : IdentityUser<Guid>
{
    public string FirstName { get; init; } = default!;
    public string LastName { get; init; } = default!;
    public string DisplayName { get; init; } = default!;
    public string PhotoUrl { get; set; } = default!;
    public DateTime CreatedTime { get; set; } = DateTime.Now;
    public DateTime LastModifiedTime { get; set; }
    public DateTime LastActiveTime { get; set; } = DateTime.Now;
}