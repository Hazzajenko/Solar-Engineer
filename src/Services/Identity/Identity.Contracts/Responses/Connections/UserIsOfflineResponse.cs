using Identity.Contracts.Data;

namespace Identity.Contracts.Responses.Connections;

public class UserIsOfflineResponse
{
    public string AppUserId { get; set; } = default!;
}