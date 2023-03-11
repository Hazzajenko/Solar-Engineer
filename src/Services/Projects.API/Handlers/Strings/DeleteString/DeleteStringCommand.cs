using Infrastructure.SignalR;
using Mediator;
using Projects.API.Common;
using Projects.API.Contracts.Requests.Strings;

namespace Projects.API.Handlers.Strings.DeleteString;

public record DeleteStringCommand(
    HubAppUser User,
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