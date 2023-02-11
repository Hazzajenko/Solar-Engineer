using Microsoft.AspNetCore.Identity;

namespace Identity.API.Models;

public class AppRole : IdentityRole<Guid>
{
    public ICollection<AppUserRole> UserRoles { get; set; } = default!;
}