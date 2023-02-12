using Microsoft.AspNetCore.Identity;

namespace Infrastructure.Entities.Identity;

public class AppRole : IdentityRole<Guid>
{
    public ICollection<AppUserRole> UserRoles { get; set; } = default!;
}