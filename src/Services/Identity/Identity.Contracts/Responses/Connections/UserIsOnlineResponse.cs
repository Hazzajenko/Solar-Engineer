using Identity.Contracts.Data;

namespace Identity.Contracts.Responses.Connections;

public class UserIsOnlineResponse
{
    public AppUserConnectionDto AppUserConnection { get; set; } = default!;
}