using Identity.Contracts.Data;

namespace Identity.Contracts.Responses;

public class UserResponse
{
    public CurrentUserDto User { get; set; } = default!;
}