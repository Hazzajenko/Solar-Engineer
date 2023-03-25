using System.Security.Claims;
using Identity.Domain.Auth;
using Mediator;

namespace Identity.Application.Handlers.AppUsers.GetAppUser;

public record GetAppUserQuery(ClaimsPrincipal ClaimsPrincipal) : IQuery<AppUser?>;