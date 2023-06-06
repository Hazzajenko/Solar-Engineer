using Infrastructure.Authentication;
using Projects.Contracts.Requests.Panels;
using Projects.Domain.Common;

namespace Projects.SignalR.Commands.Panels;

public sealed record UpdatePanelCommand(
    AuthUser User,
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