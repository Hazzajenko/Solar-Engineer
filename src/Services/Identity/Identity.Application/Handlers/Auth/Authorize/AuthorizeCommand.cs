using Identity.Domain.Auth;
using Mediator;
using Microsoft.AspNetCore.Http;

namespace Identity.Application.Handlers.Auth.Authorize;

public record AuthorizeCommand(HttpContext HttpContext) : IRequest<AppUser>;