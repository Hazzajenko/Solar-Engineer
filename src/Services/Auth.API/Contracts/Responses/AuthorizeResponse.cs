using Auth.API.Contracts.Data;

namespace Auth.API.Contracts.Responses;

public class AuthorizeResponse
{
    public CurrentUserDto User { get; set; } = default!;
}