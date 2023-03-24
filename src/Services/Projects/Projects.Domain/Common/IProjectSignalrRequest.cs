namespace Projects.Domain.Common;

public interface IProjectSignalrRequest
{
    string RequestId { get; init; }
    string ProjectId { get; init; }
}