using ApplicationCore.Extensions;
using Identity.Application.Queries.AppUsers;
using Identity.Application.Repositories.AppUsers;
using Identity.Domain;
using Infrastructure.Extensions;
using Mediator;

namespace Identity.Application.Handlers.AppUsers;

public class GetAppUserHandler : IQueryHandler<GetAppUserQuery, AppUser?>
{
    private readonly IAppUsersRepository _appUsersRepository;

    public GetAppUserHandler(IAppUsersRepository appUsersRepository)
    {
        _appUsersRepository = appUsersRepository;
    }

    public async ValueTask<AppUser?> Handle(GetAppUserQuery request, CancellationToken cT)
    {
        return await _appUsersRepository.GetByIdAsync(request.ClaimsPrincipal.GetUserId().ToGuid());
    }
}