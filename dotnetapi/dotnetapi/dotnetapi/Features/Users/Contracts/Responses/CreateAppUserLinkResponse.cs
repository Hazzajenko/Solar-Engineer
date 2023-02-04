using dotnetapi.Features.Users.Data;

namespace dotnetapi.Features.Users.Contracts.Responses;

public class CreateAppUserLinkResponse
{
    public AppUserLinkDto AppUserLink { get; set; } = default!;
}