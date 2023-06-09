using Identity.Application.Repositories.AppUsers;
using Identity.Contracts.Data;
using Mediator;

namespace Identity.Application.Handlers.AppUsers.GetAppUserDto;

public class GetAppUserDtoByIdHandler : IQueryHandler<GetAppUserDtoByIdQuery, CurrentUserDto?>
{
    private readonly IAppUsersRepository _appUsersRepository;

    public GetAppUserDtoByIdHandler(IAppUsersRepository appUsersRepository)
    {
        _appUsersRepository = appUsersRepository;
    }

    public async ValueTask<CurrentUserDto?> Handle(
        GetAppUserDtoByIdQuery request,
        CancellationToken cT
    )
    {
        return await _appUsersRepository.GetAppUserDtoByIdAsync(request.Id);
    }
}