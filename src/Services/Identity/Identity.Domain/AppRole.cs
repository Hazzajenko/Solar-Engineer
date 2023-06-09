using Microsoft.AspNetCore.Identity;

namespace Identity.Domain;

public class AppRole : IdentityRole<Guid>
{
    public ICollection<AppUserRole> UserRoles { get; set; } = default!;
}