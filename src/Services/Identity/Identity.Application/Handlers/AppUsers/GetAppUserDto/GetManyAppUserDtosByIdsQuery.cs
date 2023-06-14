using Identity.Contracts.Data;
using Mediator;

namespace Identity.Application.Handlers.AppUsers.GetAppUserDto;

public record GetManyAppUserDtosByIdsQuery(IEnumerable<Guid> AppUserIds)
    : IQuery<IEnumerable<AppUserDto>>;
