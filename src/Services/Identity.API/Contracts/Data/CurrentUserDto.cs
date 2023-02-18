namespace Identity.API.Contracts.Data;

public class CurrentUserDto
{
    public string Id { get; set; }
    public string DisplayName { get; set; } = default!;
    public string FirstName { get; init; } = default!;
    public string LastName { get; init; } = default!;
    public string PhotoUrl { get; set; } = default!;
}