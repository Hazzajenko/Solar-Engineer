using Microsoft.AspNetCore.Identity;

namespace Auth.API.Entities;

public class AppUserRole : IdentityUserRole<Guid>
{
    public AuthUser User { get; set; } = default!;
    public AppRole Role { get; set; } = default!;
}