using Infrastructure.SignalR;

namespace Projects.API.Common;

public interface IProjectCommandBase
{
    HubAppUser User { get; init; }
    string RequestId { get; init; }
    string ProjectId { get; init; }
}

public interface IProjectCommand<TRequest> : IProjectCommandBase
    where TRequest : class
{
    // HubAppUser User { get; init; }
    TRequest Request { get; init; }
    // string RequestId { get; init; }
}