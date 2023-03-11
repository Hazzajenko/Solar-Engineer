using Infrastructure.SignalR;
using Mediator;
using Projects.API.Common;
using Projects.API.Contracts.Requests.Panels;

namespace Projects.API.Handlers.Panels.DeleteManyPanels;

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