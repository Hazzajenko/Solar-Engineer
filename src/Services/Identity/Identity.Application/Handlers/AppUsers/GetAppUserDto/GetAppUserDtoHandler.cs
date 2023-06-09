using Identity.Application.Repositories.AppUsers;
using Identity.Contracts.Data;
using Infrastructure.Extensions;
using Mediator;

namespace Identity.Application.Handlers.AppUsers.GetAppUserDto;

public class GetAppUserDtoHandler : IQueryHandler<GetAppUserDtoQuery, CurrentUserDto?>
{
    private readonly IAppUsersRepository _appUsersRepository;

    public GetAppUserDtoHandler(IAppUsersRepository appUsersRepository)
    {
        _appUsersRepository = appUsersRepository;
    }

    public async ValueTask<CurrentUserDto?> Handle(GetAppUserDtoQuery request, CancellationToken cT)
    {
        return await _appUsersRepository.GetAppUserDtoByIdAsync(
            request.ClaimsPrincipal.GetUserId().ToGuid()
        );
    }
}