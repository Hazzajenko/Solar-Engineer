using ApplicationCore.Entities;
using Infrastructure.Authentication;
using Projects.Contracts.Requests.PanelLinks;
using Projects.Domain.Common;

namespace Projects.SignalR.Commands.PanelLinks;

public record DeletePanelLinkCommand(
    AuthUser User,
    DeletePanelLinkRequest Request,
    string RequestId,
    string ProjectId
) : ICommand<bool>, IProjectCommand<DeletePanelLinkRequest>
{
    public DeletePanelLinkCommand()
        : this(null!, null!, null!, null!) { }
}
