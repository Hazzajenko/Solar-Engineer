using System.Security.Claims;
using Identity.Contracts.Data;
using Mediator;

namespace Identity.Application.Handlers.AppUsers.GetAppUserDto;

public record GetAppUserDtoQuery(ClaimsPrincipal ClaimsPrincipal) : IQuery<CurrentUserDto?>;