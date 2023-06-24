using System.Security.Claims;
using Identity.Contracts.Data;
using Mediator;

namespace Identity.Application.Queries.AppUsers;

public record GetAppUserDtoQuery(ClaimsPrincipal ClaimsPrincipal) : IQuery<AppUserDto?>;
// public record GetAppUserDtoQuery(Guid Id) : IQuery<CurrentUserDto?>;