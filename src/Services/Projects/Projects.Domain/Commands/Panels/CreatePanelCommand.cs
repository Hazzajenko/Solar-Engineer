using Infrastructure.Authentication;
using Projects.Domain.Common;
using Projects.Domain.Contracts.Requests.Panels;

namespace Projects.Domain.Commands.Panels;

public record CreatePanelCommand(AuthUser User, CreatePanelRequest Request, string RequestId, string ProjectId)
    : ICommand<bool>,
        IProjectCommand<CreatePanelRequest>
{
    public CreatePanelCommand()
        : this(null!, null!, null!, null!)
    {
    }
}