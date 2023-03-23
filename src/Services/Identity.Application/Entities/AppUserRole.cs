using Microsoft.AspNetCore.Identity;

namespace Identity.Application.Entities;

public class AppUserRole : IdentityUserRole<Guid>
{
    public AppUser User { get; set; } = default!;
    public AppRole Role { get; set; } = default!;
}