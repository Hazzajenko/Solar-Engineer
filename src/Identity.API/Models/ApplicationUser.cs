using Microsoft.AspNetCore.Identity;

namespace Identity.API.Models;

public class ApplicationUser : IdentityUser<Guid>
{
    public string? FirstName { get; init; }
    public string? LastName { get; init; }
}