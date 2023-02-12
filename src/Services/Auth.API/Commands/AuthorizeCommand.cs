using Auth.API.Contracts.Data;
using Mediator;

namespace Auth.API.Commands;

public sealed record AuthorizeCommand(HttpContext HttpContext)
    : IRequest<CurrentUserDto>;