using Identity.Contracts.Data;

namespace Identity.Contracts.Responses.Connections;

public class GetOnlineUsersResponse
{
    public IEnumerable<AppUserConnectionDto> OnlineUsers { get; set; } =
        new List<AppUserConnectionDto>();
}
