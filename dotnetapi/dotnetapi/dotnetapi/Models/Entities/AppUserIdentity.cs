using Microsoft.AspNetCore.Identity;

namespace dotnetapi.Models.Entities;

public class AppUserIdentity : IdentityUserLogin<int>
{
    public AppUser AppUser { get; set; } = default!;
}