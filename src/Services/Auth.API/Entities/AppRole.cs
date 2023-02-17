using Microsoft.AspNetCore.Identity;

namespace Auth.API.Entities;

public class AppRole : IdentityRole<Guid>
{
    public ICollection<AppUserRole> UserRoles { get; set; } = default!;
}