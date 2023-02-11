using Microsoft.AspNetCore.Identity;

namespace Auth.API.Domain;

public class AppUserRole : IdentityUserRole<int> {
    public AppUser User { get; set; } = default!;
    public AppRole Role { get; set; } = default!;
}