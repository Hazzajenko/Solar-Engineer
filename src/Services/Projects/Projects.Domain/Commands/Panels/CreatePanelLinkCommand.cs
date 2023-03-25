using Infrastructure.Authentication;
using Projects.Domain.Common;
using Projects.Domain.Contracts.Requests.PanelLinks;

namespace Projects.Domain.Commands.Panels;

public record CreatePanelLinkCommand(
    AuthUser User,
    CreatePanelLinkRequest Request,
    string RequestId,
    string ProjectId
) : ICommand<bool>, IProjectCommand<CreatePanelLinkRequest>
{
    public CreatePanelLinkCommand()
        : this(null!, null!, null!, null!)
    {
    }
}