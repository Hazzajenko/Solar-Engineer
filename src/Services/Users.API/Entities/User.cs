using Infrastructure.Common;

namespace Users.API.Entities;

public class User : IEntity
{
    public string FirstName { get; init; } = default!;
    public string LastName { get; init; } = default!;
    public string DisplayName { get; init; } = default!;
    public string PhotoUrl { get; set; } = default!;
    public Guid Id { get; init; }
    public DateTime CreatedTime { get; set; }
    public DateTime LastModifiedTime { get; set; }
}