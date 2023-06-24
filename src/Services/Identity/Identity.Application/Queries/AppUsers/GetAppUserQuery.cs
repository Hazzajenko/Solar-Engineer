using System.Security.Claims;
using Identity.Domain;
using Mediator;

namespace Identity.Application.Queries.AppUsers;

public record GetAppUserQuery(ClaimsPrincipal ClaimsPrincipal) : IQuery<AppUser?>;