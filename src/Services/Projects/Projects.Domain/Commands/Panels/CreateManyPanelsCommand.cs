using Infrastructure.Authentication;
using Projects.Domain.Common;
using Projects.Domain.Contracts.Requests.Panels;

namespace Projects.Domain.Commands.Panels;

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