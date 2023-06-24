using ApplicationCore.Entities;
using Infrastructure.Authentication;

namespace Projects.Domain.Common;

public interface IProjectCommand
{
    AuthUser User { get; init; }
    string RequestId { get; init; }
    string ProjectId { get; init; }
}

public interface IProjectCommand<TRequest> : IProjectCommand
    where TRequest : class
{
    TRequest Request { get; init; }
}