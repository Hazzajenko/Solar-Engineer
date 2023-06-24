using ApplicationCore.Entities;
using Infrastructure.Authentication;
using Projects.Contracts.Requests.Panels;
using Projects.Domain.Common;

namespace Projects.SignalR.Commands.Panels;

public record DeletePanelCommand(
    AuthUser User,
    DeletePanelRequest Request,
    string RequestId,
    string ProjectId
) : ICommand<bool>, IProjectCommand<DeletePanelRequest>
{
    public DeletePanelCommand()
        : this(null!, null!, null!, null!)
    {
    }
}