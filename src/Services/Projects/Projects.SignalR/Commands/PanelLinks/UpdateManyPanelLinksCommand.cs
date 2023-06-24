using ApplicationCore.Entities;
using Infrastructure.Authentication;
using Projects.Contracts.Requests.PanelLinks;
using Projects.Domain.Common;

namespace Projects.SignalR.Commands.PanelLinks;

public record UpdateManyPanelLinksCommand(
    AuthUser User,
    UpdateManyPanelLinksRequest Request,
    string RequestId,
    string ProjectId
) : ICommand<bool>, IProjectCommand<UpdateManyPanelLinksRequest>
{
    public UpdateManyPanelLinksCommand()
        : this(null!, null!, null!, null!) { }
}
