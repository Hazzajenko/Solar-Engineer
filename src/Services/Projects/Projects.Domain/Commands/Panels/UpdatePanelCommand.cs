using Infrastructure.Authentication;
using Projects.Domain.Common;
using Projects.Domain.Contracts.Requests.Panels;

namespace Projects.Domain.Commands.Panels;

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