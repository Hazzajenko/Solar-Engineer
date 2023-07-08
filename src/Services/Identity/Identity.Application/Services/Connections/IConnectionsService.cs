using Identity.Contracts.Data;

namespace Identity.Application.Services.Connections;

public interface IConnectionsService
{
    int ConnectedUsersCount { get; }
    void Add(Guid appUserId, string connectionId);
    AppUserConnectionDto? GetAppUserConnectionByAppUserId(Guid appUserId);

    bool UpdateLastActiveTime(Guid appUserId);
    bool AddDeviceInfoToUserIdAndConnectionId(
        Guid appUserId,
        string connectionId,
        DeviceInfoDto deviceInfo
    );
    bool IsUserOnline(Guid appUserId);
    DateTime GetLastActiveTime(Guid appUserId);
    TimeSpan GetConnectionDurationByAppUserId(Guid appUserId);

    IEnumerable<string> GetConnections(Guid key);
    IEnumerable<Guid> GetAllConnectedUserIds();
    IEnumerable<ConnectionDto> GetConnectionsByIds(IEnumerable<Guid> keys);
    IEnumerable<AppUserConnectionDto> GetAllUserConnections();
    IEnumerable<AppUserConnectionDto> GetUserConnectionsByIds(IEnumerable<Guid> keys);
    void Remove(Guid appUserId, string connectionId);
}
