using Infrastructure.SignalR;
using Mediator;
using Projects.API.Common;
using Projects.API.Contracts.Requests.PanelLinks;

namespace Projects.API.Handlers.PanelLinks.CreatePanelLink;

public record CreatePanelLinkCommand(
    HubAppUser User,
    CreatePanelLinkRequest Request,
    string RequestId,
    string ProjectId
) : ICommand<bool>, IProjectCommand<CreatePanelLinkRequest>
{
    public CreatePanelLinkCommand()
        : this(null!, null!, null!, null!)
    {
    }
}