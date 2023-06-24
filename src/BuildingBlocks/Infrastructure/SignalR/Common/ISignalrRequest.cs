using Infrastructure.Authentication;

namespace Infrastructure.SignalR.Common;

public interface ISignalrRequest
{
    AuthUser AuthUser { get; init; }
}
