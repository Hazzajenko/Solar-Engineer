using System.Security.Claims;
using Mediator;
using Projects.API.Contracts.Requests.Panels;

namespace Projects.API.Handlers.Panels.UpdatePanel;

public sealed record UpdatePanelCommand(ClaimsPrincipal User, UpdatePanelRequest UpdatePanel)
    : ICommand<bool>;