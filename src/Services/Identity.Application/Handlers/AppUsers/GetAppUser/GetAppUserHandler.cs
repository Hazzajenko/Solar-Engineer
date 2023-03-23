using Identity.Application.Repositories.AppUsers;
using Identity.Domain.Auth;
using Infrastructure.Extensions;
using Mediator;

namespace Identity.Application.Handlers.AppUsers.GetAppUser;

public class GetAppUserHandler : IQueryHandler<GetAppUserQuery, AppUser?>
{
    private readonly IAppUserRepository _appUserRepository;

    public GetAppUserHandler(IAppUserRepository appUserRepository)
    {
        _appUserRepository = appUserRepository;
    }

    public async ValueTask<AppUser?> Handle(GetAppUserQuery request, CancellationToken cT)
    {
        return await _appUserRepository.GetByIdAsync(request.ClaimsPrincipal.GetUserId().ToGuid());
    }
}