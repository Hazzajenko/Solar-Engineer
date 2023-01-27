namespace dotnetapi.Features.Users.Data;

public class GetUserDto
{
    public int Id { get; set; }
    public string UserName { get; init; } = default!;
    public string FirstName { get; init; } = default!;
    public string LastName { get; init; } = default!;
    public string PhotoUrl { get; set; } = default!;
    public DateTime Created { get; set; }
    public DateTime LastActive { get; set; } = DateTime.Now;
}