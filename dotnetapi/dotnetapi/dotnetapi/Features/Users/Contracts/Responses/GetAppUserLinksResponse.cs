using dotnetapi.Features.Users.Data;

namespace dotnetapi.Features.Users.Contracts.Responses;

public class GetAppUserLinksResponse
{
    public IEnumerable<AppUserToUserDto> AppUserLinks { get; set; } = default!;
}