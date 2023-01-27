using dotnetapi.Models.SignalR;

namespace dotnetapi.Mapping;

public static class ConnectionMapper
{
    public static ConnectionDto ToDto(this UserConnection request)
    {
        return new ConnectionDto
        {
            UserId = request.UserId,
            UserName = request.UserName
        };
    }

    public static UserConnectionDto ToUsernameDto(this UserConnection request)
    {
        return new UserConnectionDto
        {
            UserName = request.UserName
        };
    }
}