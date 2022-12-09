using Microsoft.AspNetCore.Identity;

namespace dotnetapi.Models.Entities;

public class AppRole : IdentityRole<int> {
    public ICollection<AppUserRole> UserRoles { get; set; } = default!;
}