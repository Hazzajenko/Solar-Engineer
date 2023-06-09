using System.Security.Claims;
using Identity.Domain;
using Mediator;

namespace Identity.Application.Handlers.AppUsers.GetAppUser;

public record GetAppUserQuery(ClaimsPrincipal ClaimsPrincipal) : IQuery<AppUser?>;