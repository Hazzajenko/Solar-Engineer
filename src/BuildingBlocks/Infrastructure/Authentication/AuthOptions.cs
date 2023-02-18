namespace Infrastructure.Authentication;

public class AuthOptions
{
    public string Authority { get; set; } = default!;
    public string Audience { get; set; } = default!;
}