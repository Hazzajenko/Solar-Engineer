using Identity.Application.Entities;
using Mediator;
using Microsoft.AspNetCore.Http;

namespace Identity.Application.Handlers.Auth.Authorize;

public record AuthorizeCommand(HttpContext HttpContext) : IRequest<AppUser>;