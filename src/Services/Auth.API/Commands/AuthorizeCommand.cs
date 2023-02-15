using FastEndpoints;
using Infrastructure.Entities.Identity;

namespace Auth.API.Commands;

public sealed record AuthorizeCommand(HttpContext HttpContext)
    : ICommand<AppUser>;