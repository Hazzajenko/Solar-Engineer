namespace dotnetapi.Models.Dtos;

public class AppUserDto
{
    public string UserName { get; set; } = default!;
    public string FirstName { get; init; } = default!;
    public string LastName { get; init; } = default!;
    public string PhotoUrl { get; set; } = default!;
    public DateTime Created { get; set; }
    public DateTime LastActive { get; set; } = DateTime.Now;
}