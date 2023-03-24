using Infrastructure.SignalR;

namespace Projects.Domain.Common;

public interface IProjectCommand
{
    HubAppUser User { get; init; }
    string RequestId { get; init; }
    string ProjectId { get; init; }
}

public interface IProjectCommand<TRequest> : IProjectCommand
    where TRequest : class
{
    // HubAppUser User { get; init; }
    TRequest Request { get; init; }
    // string RequestId { get; init; }
}