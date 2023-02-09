using Microsoft.AspNetCore.Identity;

namespace Auth.API.Domain;

public class AppRole : IdentityRole<int> {
    public ICollection<AppUserRole> UserRoles { get; set; } = default!;
}