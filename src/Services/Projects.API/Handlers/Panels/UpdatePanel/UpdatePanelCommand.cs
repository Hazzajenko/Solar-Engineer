using Infrastructure.SignalR;
using Mediator;
using Projects.API.Common;
using Projects.API.Contracts.Requests.Panels;

namespace Projects.API.Handlers.Panels.UpdatePanel;

public sealed record UpdatePanelCommand(
    HubAppUser User,
    UpdatePanelRequest Request,
    string RequestId,
    string ProjectId
) : ICommand<bool>, IProjectCommand<UpdatePanelRequest>
{
    public UpdatePanelCommand()
        : this(null!, null!, null!, null!)
    {
    }
}