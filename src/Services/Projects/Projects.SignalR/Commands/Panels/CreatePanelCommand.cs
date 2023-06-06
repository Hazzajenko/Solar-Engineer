using Infrastructure.Authentication;
using Projects.Contracts.Requests.Panels;
using Projects.Domain.Common;

namespace Projects.SignalR.Commands.Panels;

public record CreatePanelCommand(AuthUser User, CreatePanelRequest Request, string RequestId, string ProjectId)
    : ICommand<bool>,
        IProjectCommand<CreatePanelRequest>
{
    public CreatePanelCommand()
        : this(null!, null!, null!, null!)
    {
    }
}