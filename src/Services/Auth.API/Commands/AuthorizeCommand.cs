using Infrastructure.Entities.Identity;
using Mediator;

namespace Auth.API.Commands;

public sealed record AuthorizeCommand(HttpContext HttpContext)
    : IRequest<AppUser>;