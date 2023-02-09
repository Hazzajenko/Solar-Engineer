namespace dotnetapi.Features.Auth.Data;

public class CurrentAuthUserDto
{
    public string DisplayName { get; set; } = default!;
    public string FirstName { get; init; } = default!;
    public string LastName { get; init; } = default!;
    public string PhotoUrl { get; set; } = default!;
}