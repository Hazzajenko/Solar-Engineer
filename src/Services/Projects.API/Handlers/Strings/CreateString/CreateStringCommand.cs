using Infrastructure.SignalR;
using Mediator;
using Projects.API.Common;
using Projects.API.Contracts.Requests.Strings;

namespace Projects.API.Handlers.Strings.CreateString;

public sealed record CreateStringCommand(
    HubAppUser User,
    CreateStringRequest Request,
    string RequestId
) : ICommand<bool>, IProjectCommand<CreateStringRequest>
{
    public CreateStringCommand()
        : this(null, null, null)
    {
    }
}