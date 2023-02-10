using System.Security.Claims;

using Auth.API.Domain;

using Mediator;

namespace Auth.API.Commands;

public sealed record LoginCommand(ClaimsPrincipal User)
    : IRequest<AppUser>;