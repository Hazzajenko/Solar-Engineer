using Infrastructure.Authentication;
using Projects.Domain.Common;
using Projects.Domain.Contracts.Requests.Strings;

namespace Projects.Domain.Commands.Strings;

public record DeleteStringCommand(
    AuthUser User,
    DeleteStringRequest Request,
    string RequestId,
    string ProjectId
) : ICommand<bool>, IProjectCommand<DeleteStringRequest>
{
    public DeleteStringCommand()
        : this(null!, null!, null!, null!)
    {
    }
}