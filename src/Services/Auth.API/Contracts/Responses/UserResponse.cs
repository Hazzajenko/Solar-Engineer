using Auth.API.Contracts.Data;

namespace Auth.API.Contracts.Responses;

public class UserResponse
{
    public CurrentUserDto User { get; set; } = default!;
}