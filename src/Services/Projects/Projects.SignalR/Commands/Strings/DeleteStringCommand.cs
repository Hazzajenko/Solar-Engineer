using Infrastructure.Authentication;
using Projects.Contracts.Requests.Strings;
using Projects.Domain.Common;

namespace Projects.SignalR.Commands.Strings;

public record DeleteStringCommand(
    AuthUser User,
    DeleteStringRequest Request,
    string RequestId,
    string ProjectId
) : ICommand<bool>, IProjectCommand<DeleteStringRequest>
{
    public DeleteStringCommand()
        : this(null!, null!, null!, null!)
    {
    }
}