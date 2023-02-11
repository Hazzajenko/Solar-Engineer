using Microsoft.AspNetCore.Identity;

namespace Identity.API.Models;

public class AppUserRole : IdentityUserRole<Guid>
{
    public ApplicationUser User { get; set; } = default!;
    public AppRole Role { get; set; } = default!;
}