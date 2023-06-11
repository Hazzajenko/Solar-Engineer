namespace Identity.Contracts.Data;

public class AppUserDto
{
    public string FirstName { get; init; } = default!;
    public string LastName { get; init; } = default!;
    public Guid Id { get; set; }
    public string DisplayName { get; set; } = default!;
    public string UserName { get; set; } = default!;
    public string PhotoUrl { get; set; } = default!;
    public DateTime CreatedTime { get; set; }
    public DateTime LastModifiedTime { get; set; }
}

public class MinimalAppUserDto
{
    public string Id { get; set; } = default!;
    public string UserName { get; set; } = default!;
    public string DisplayName { get; set; } = default!;
    public string PhotoUrl { get; set; } = default!;
}
