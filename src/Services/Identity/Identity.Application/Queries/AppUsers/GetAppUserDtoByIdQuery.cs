using Identity.Contracts.Data;
using Mediator;

namespace Identity.Application.Queries.AppUsers;

public record GetAppUserDtoByIdQuery(Guid Id) : IQuery<AppUserDto?>;
// public record GetAppUserDtoQuery(Guid Id) : IQuery<CurrentUserDto?>;
