using Infrastructure.SignalR;
using Projects.Domain.Common;
using Projects.Domain.Contracts.Requests.Panels;

namespace Projects.Domain.Commands.Panels;

public record UpdateManyPanelsCommand(
    HubAppUser User,
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