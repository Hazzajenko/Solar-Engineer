using Microsoft.AspNetCore.Identity;

namespace Infrastructure.Entities.Identity;

public class AppUserRole : IdentityUserRole<Guid>
{
    public AppUser User { get; set; } = default!;
    public AppRole Role { get; set; } = default!;
}