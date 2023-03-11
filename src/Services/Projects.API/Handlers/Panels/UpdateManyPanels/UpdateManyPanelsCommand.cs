using Infrastructure.SignalR;
using Mediator;
using Projects.API.Common;
using Projects.API.Contracts.Requests.Panels;

namespace Projects.API.Handlers.Panels.UpdateManyPanels;

public record UpdateManyPanelsCommand(
    HubAppUser User,
    UpdateManyPanelsRequest Request,
    string RequestId,
    string ProjectId
) : ICommand<bool>, IProjectCommand<UpdateManyPanelsRequest>
{
    public UpdateManyPanelsCommand()
        : this(null!, null!, null!, null!)
    {
    }
}