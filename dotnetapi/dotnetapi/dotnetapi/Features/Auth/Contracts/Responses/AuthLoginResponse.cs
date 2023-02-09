using dotnetapi.Features.Auth.Data;

namespace dotnetapi.Features.Auth.Contracts.Responses;

public class AuthLoginResponse
{
    public CurrentAuthUserDto User { get; set; } = default!;
}