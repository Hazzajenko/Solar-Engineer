using Identity.Contracts.Data;

namespace Identity.Contracts.Responses.Users;

public class SearchForAppUserResponse
{
    public IEnumerable<WebUserDto> Users { get; set; } = new List<WebUserDto>();
}
