using Identity.Contracts.Data;

namespace Identity.Contracts.Responses;

public class AuthorizeResponse
{
    public AppUserDto User { get; set; } = default!;
    public string Token { get; set; } = default!;
}
