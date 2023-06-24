using ApplicationCore.Entities;
using Infrastructure.Authentication;
using Projects.Contracts.Requests.Panels;
using Projects.Domain.Common;

namespace Projects.SignalR.Commands.Panels;

public record UpdateManyPanelsCommand(
    AuthUser User,
    UpdateManyPanelsRequest Request,
    string RequestId,
    string ProjectId
) : ICommand<bool>, IProjectCommand<UpdateManyPanelsRequest>
{
    public UpdateManyPanelsCommand()
        : this(null!, null!, null!, null!)
    {
    }
}