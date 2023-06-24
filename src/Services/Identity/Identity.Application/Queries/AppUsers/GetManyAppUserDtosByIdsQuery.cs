using Identity.Contracts.Data;
using Mediator;

namespace Identity.Application.Queries.AppUsers;

public record GetManyAppUserDtosByIdsQuery(IEnumerable<Guid> AppUserIds)
    : IQuery<IEnumerable<AppUserDto>>;
