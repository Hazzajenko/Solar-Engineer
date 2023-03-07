using System.Security.Claims;
using Mediator;
using Projects.API.Contracts.Requests.Strings;

namespace Projects.API.Handlers.Strings.CreateString;

public sealed record CreateStringCommand(ClaimsPrincipal User, CreateStringRequest CreateString)
    : ICommand<bool>;