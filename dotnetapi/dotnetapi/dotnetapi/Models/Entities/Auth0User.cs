namespace dotnetapi.Models.Entities;

public class Auth0User
{
    public string Id { get; set; } = default!;
    public AppUser AppUser { get; set; } = default!;
    public int AppUserId { get; set; }
}