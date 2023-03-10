using Infrastructure.SignalR;
using Mediator;
using Projects.API.Common;
using Projects.API.Contracts.Requests.Panels;

namespace Projects.API.Handlers.Panels.CreateManyPanels;

public record CreateManyPanelsCommand(HubAppUser User, CreateManyPanelsRequest Request, string RequestId,
        string ProjectId)
    : ICommand<bool>,
        IProjectCommand<CreateManyPanelsRequest>
{
    public CreateManyPanelsCommand()
        : this(null!, null!, null!, null!)
    {
    }
}