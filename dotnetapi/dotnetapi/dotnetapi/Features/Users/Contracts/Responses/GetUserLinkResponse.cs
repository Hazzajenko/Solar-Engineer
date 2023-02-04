using dotnetapi.Features.Users.Data;

namespace dotnetapi.Features.Users.Contracts.Responses;

public class GetUserLinkResponse
{
    public AppUserToUserDto User { get; set; } = default!;
}