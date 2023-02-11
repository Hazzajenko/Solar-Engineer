using Auth.API.Domain;
using Mediator;

namespace Auth.API.Commands;

public sealed record AuthorizeCommand(HttpContext HttpContext)
    : IRequest<AppUser>;