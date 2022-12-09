using Microsoft.AspNetCore.Identity;

namespace dotnetapi.Models.Entities;

public class AppUserRole : IdentityUserRole<int> {
    public AppUser User { get; set; } = default!;
    public AppRole Role { get; set; } = default!;
}