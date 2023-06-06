using Infrastructure.Authentication;
using Projects.Contracts.Requests.Strings;
using Projects.Domain.Common;

namespace Projects.SignalR.Commands.Strings;

public sealed record UpdateStringCommand(
    AuthUser User,
    UpdateStringRequest Request,
    string RequestId,
    string ProjectId
) : ICommand<bool>, IProjectCommand<UpdateStringRequest>
{
    public UpdateStringCommand()
        : this(null!, null!, null!, null!)
    {
    }
}