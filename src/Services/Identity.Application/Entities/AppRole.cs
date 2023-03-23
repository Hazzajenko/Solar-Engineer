using Microsoft.AspNetCore.Identity;

namespace Identity.Application.Entities;

public class AppRole : IdentityRole<Guid>
{
    public ICollection<AppUserRole> UserRoles { get; set; } = default!;
}