using Infrastructure.SignalR;
using Projects.Domain.Common;
using Projects.Domain.Contracts.Requests.Panels;

namespace Projects.Domain.Commands.Panels;

public record DeleteManyPanelsCommand(HubAppUser User, DeleteManyPanelsRequest Request, string RequestId,
        string ProjectId)
    : ICommand<bool>,
        IProjectCommand<DeleteManyPanelsRequest>
{
    public DeleteManyPanelsCommand()
        : this(null!, null!, null!, null!)
    {
    }
}