using Identity.Application.Repositories.AppUsers;
using Identity.Contracts.Data;
using Mediator;

namespace Identity.Application.Handlers.AppUsers.GetAppUserDto;

public class GetAppUserDtoByIdHandler : IQueryHandler<GetAppUserDtoByIdQuery, CurrentUserDto?>
{
    private readonly IAppUserRepository _appUserRepository;

    public GetAppUserDtoByIdHandler(IAppUserRepository appUserRepository)
    {
        _appUserRepository = appUserRepository;
    }

    public async ValueTask<CurrentUserDto?> Handle(
        GetAppUserDtoByIdQuery request,
        CancellationToken cT
    )
    {
        return await _appUserRepository.GetAppUserDtoByIdAsync(request.Id);
    }
}