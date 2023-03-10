using Infrastructure.SignalR;
using Mediator;
using Projects.API.Common;
using Projects.API.Contracts.Requests.Strings;

namespace Projects.API.Handlers.Strings.CreateString;

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