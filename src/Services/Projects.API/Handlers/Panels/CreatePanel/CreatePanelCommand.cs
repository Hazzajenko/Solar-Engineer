using Infrastructure.SignalR;
using Mediator;
using Projects.API.Common;
using Projects.API.Contracts.Requests.Panels;

namespace Projects.API.Handlers.Panels.CreatePanel;

public record CreatePanelCommand(HubAppUser User, CreatePanelRequest Request, string RequestId, string ProjectId)
    : ICommand<bool>,
        IProjectCommand<CreatePanelRequest>
{
    public CreatePanelCommand()
        : this(null!, null!, null!, null!)
    {
    }
}