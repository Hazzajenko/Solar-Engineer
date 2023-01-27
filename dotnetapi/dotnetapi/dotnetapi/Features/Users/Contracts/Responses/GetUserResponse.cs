using dotnetapi.Features.Users.Data;

namespace dotnetapi.Features.Users.Contracts.Responses;

public class GetUserResponse
{
    public GetUserDto User { get; set; } = default!;
}