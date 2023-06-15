using Identity.Contracts.Data;
using Identity.Domain;

namespace Identity.SignalR.Mapping;

public static class ConnectionsMapper
{
    public static ConnectionDto ToDto(this AppUserConnectionDto request)
    {
        return new ConnectionDto
        {
            AppUserId = request.AppUserId.ToString()
        };
    }

    public static List<ConnectionDto> ToDtoList(this AppUserConnectionDto request)
    {
        return new List<ConnectionDto>
        {
            request.ToDto()
        };
    }
}