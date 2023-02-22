using System.Security.Claims;
using Auth.API.Entities;
using Auth.API.Repositories;
using Infrastructure.Extensions;
using Mediator;

namespace Auth.API.Handlers;

public sealed record GetAppUserQuery(ClaimsPrincipal ClaimsPrincipal)
    : IQuery<AuthUser?>;

public class GetAppUserHandler
    : IQueryHandler<GetAppUserQuery, AuthUser?>
{
    private readonly IAppUserRepository _appUserRepository;

    public GetAppUserHandler(IAppUserRepository appUserRepository)
    {
        _appUserRepository = appUserRepository;
    }

    public async ValueTask<AuthUser?> Handle(
        GetAppUserQuery request,
        CancellationToken cT
    )
    {
        return await _appUserRepository.GetByIdAsync(request.ClaimsPrincipal.GetUserId().ToGuid());
    }
}