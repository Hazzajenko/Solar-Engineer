using Identity.Contracts.Data;

namespace Identity.Contracts.Requests.Users;

public class SearchForAppUserRequest
{
    public required string SearchQuery { get; set; }
}
