using ApplicationCore.Interfaces;

namespace ApplicationCore.Entities;

public class User : IAppUser
{
    public Guid Id { get; set; }
    public string FirstName { get; init; } = default!;
    public string LastName { get; init; } = default!;
    public string UserName { get; set; } = default!;
    public string DisplayName { get; init; } = default!;
    public string PhotoUrl { get; set; } = default!;
    public DateTime CreatedTime { get; set; }
    public DateTime LastModifiedTime { get; set; }
}
