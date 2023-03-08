using Infrastructure.SignalR;

namespace Projects.API.Common;

public interface IProjectCommand<TRequest>
    where TRequest : class
{
    HubAppUser User { get; init; }
    TRequest Request { get; init; }
    string RequestId { get; init; }
}