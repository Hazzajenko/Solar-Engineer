using Microsoft.AspNetCore.Identity;

namespace dotnetapi.Models.Entities;

public class AppUser : IdentityUser<int>
{
    public string FirstName { get; init; } = default!;
    public string LastName { get; init; } = default!;
    public string PhotoUrl { get; set; } = default!;
    public DateTime Created { get; set; } = DateTime.Now;
    public DateTime LastActive { get; set; } = DateTime.Now;
    public ICollection<AppUserProject> AppUserProjects { get; set; } = default!;

    public ICollection<AppUserRole> UserRoles { get; set; } = default!;
    // public ICollection<AppUserConnection> Connections { get; set; } = default!;
}