using System.Security.Claims;
using Mediator;
using Projects.API.Contracts.Requests.Panels;

namespace Projects.API.Handlers.Panels.CreatePanel;

public sealed record CreatePanelCommand(ClaimsPrincipal User, CreatePanelRequest Request)
    : ICommand<bool>;