using Microsoft.AspNetCore.Identity;

namespace Infrastructure.Entities.Identity;

public class AppUserLogin : IdentityUserLogin<Guid>
{
    public string ProviderEmail { get; set; } = default!;
}