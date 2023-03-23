using System.Security.Claims;
using Identity.Application.Entities;
using Mediator;

namespace Identity.Application.Handlers.AppUsers;

public record GetAppUserQuery(ClaimsPrincipal ClaimsPrincipal) : IQuery<AppUser?>;