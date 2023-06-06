using Infrastructure.Authentication;
using Projects.Contracts.Requests.Strings;
using Projects.Domain.Common;

namespace Projects.SignalR.Commands.Strings;

public sealed record CreateStringCommand(
    AuthUser User,
    CreateStringRequest Request,
    string RequestId,
    string ProjectId
) : ICommand<bool>, IProjectCommand<CreateStringRequest>
{
    public CreateStringCommand()
        : this(null!, null!, null!, null!)
    {
    }
}