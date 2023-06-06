using Infrastructure.Authentication;
using Projects.Contracts.Requests.Panels;
using Projects.Domain.Common;

namespace Projects.SignalR.Commands.Panels;

public record CreateManyPanelsCommand(
    AuthUser User,
    CreateManyPanelsRequest Request,
    string RequestId,
    string ProjectId
) : ICommand<bool>, IProjectCommand<CreateManyPanelsRequest>
{
    public CreateManyPanelsCommand()
        : this(null!, null!, null!, null!)
    {
    }
}