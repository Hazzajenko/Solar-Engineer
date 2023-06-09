using Identity.Contracts.Data;
using Identity.Domain;

namespace Identity.SignalR.Mapping;

public static class ConnectionsMapper
{
    public static ConnectionDto ToDto(this AppUserConnection request)
    {
        return new ConnectionDto
        {
            UserId = request.AppUserId.ToString()
        };
    }

    public static List<ConnectionDto> ToDtoList(this AppUserConnection request)
    {
        return new List<ConnectionDto>
        {
            request.ToDto()
        };
    }
}