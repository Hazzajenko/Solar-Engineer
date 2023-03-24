using Infrastructure.SignalR;
using Projects.Domain.Common;
using Projects.Domain.Contracts.Requests.Strings;

namespace Projects.Domain.Commands.Strings;

public sealed record CreateStringCommand(
    HubAppUser User,
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