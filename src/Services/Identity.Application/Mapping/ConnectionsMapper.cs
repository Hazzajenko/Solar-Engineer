using Identity.Application.Entities;
using Identity.Contracts.Data;

namespace Identity.Application.Mapping;

public static class ConnectionsMapper
{
    public static ConnectionDto ToDto(this UserConnection request)
    {
        return new ConnectionDto { UserId = request.UserId.ToString() };
    }

    public static List<ConnectionDto> ToDtoList(this UserConnection request)
    {
        return new List<ConnectionDto> { request.ToDto() };
    }
}

// IUser