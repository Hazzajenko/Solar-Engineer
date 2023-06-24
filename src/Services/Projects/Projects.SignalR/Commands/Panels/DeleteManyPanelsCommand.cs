using ApplicationCore.Entities;
using Infrastructure.Authentication;
using Projects.Contracts.Requests.Panels;
using Projects.Domain.Common;

namespace Projects.SignalR.Commands.Panels;

public record DeleteManyPanelsCommand(
    AuthUser User,
    DeleteManyPanelsRequest Request,
    string RequestId,
    string ProjectId
) : ICommand<bool>, IProjectCommand<DeleteManyPanelsRequest>
{
    public DeleteManyPanelsCommand()
        : this(null!, null!, null!, null!)
    {
    }
}