using Identity.Application.Repositories.AppUsers;
using Identity.Contracts.Data;
using Infrastructure.Extensions;
using Mediator;

namespace Identity.Application.Handlers.AppUsers.GetAppUserDto;

public class GetAppUserDtoHandler : IQueryHandler<GetAppUserDtoQuery, CurrentUserDto?>
{
    private readonly IAppUserRepository _appUserRepository;

    public GetAppUserDtoHandler(IAppUserRepository appUserRepository)
    {
        _appUserRepository = appUserRepository;
    }

    public async ValueTask<CurrentUserDto?> Handle(GetAppUserDtoQuery request, CancellationToken cT)
    {
        return await _appUserRepository.GetAppUserDtoByIdAsync(
            request.ClaimsPrincipal.GetUserId().ToGuid()
        );
    }
}