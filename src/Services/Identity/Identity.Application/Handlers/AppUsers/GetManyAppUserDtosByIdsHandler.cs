using Identity.Application.Data.UnitOfWork;
using Identity.Application.Queries.AppUsers;
using Identity.Contracts.Data;
using Mediator;

namespace Identity.Application.Handlers.AppUsers;

public class GetManyAppUserDtosByIdsHandler
    : IQueryHandler<GetManyAppUserDtosByIdsQuery, IEnumerable<AppUserDto>>
{
    private readonly IIdentityUnitOfWork _unitOfWork;

    public GetManyAppUserDtosByIdsHandler(IIdentityUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async ValueTask<IEnumerable<AppUserDto>> Handle(
        GetManyAppUserDtosByIdsQuery query,
        CancellationToken cT
    )
    {
        return await _unitOfWork.AppUsersRepository.GetManyAppUserDtosByIdsAsync(query.AppUserIds);
    }
}
