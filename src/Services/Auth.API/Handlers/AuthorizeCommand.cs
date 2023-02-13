using Auth.API.Contracts.Data;
using Mediator;

namespace Auth.API.Handlers;

public sealed record AuthorizeCommand(HttpContext HttpContext)
    : IRequest<CurrentUserDto>;