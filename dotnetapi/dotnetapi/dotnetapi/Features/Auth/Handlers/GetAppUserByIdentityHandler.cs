using dotnetapi.Data;
using dotnetapi.Models.Entities;
using Mediator;
using Microsoft.EntityFrameworkCore;

namespace dotnetapi.Features.Auth.Handlers;

public sealed record GetAppUserByIdentityQuery(string LoginProvider, string ProviderKey)
    : IRequest<AppUserIdentity?>;

public class GetAppUserByIdentityHandler
    : IRequestHandler<GetAppUserByIdentityQuery, AppUserIdentity?>
{
    private readonly IDataContext _context;

    public GetAppUserByIdentityHandler(IDataContext context)
    {
        _context = context;
    }

    public async ValueTask<AppUserIdentity?> Handle(
        GetAppUserByIdentityQuery request,
        CancellationToken cT
    )
    {
        return await _context.AppUserIdentities
            .Where(
                x =>
                    x.LoginProvider == request.LoginProvider && x.ProviderKey == request.ProviderKey
            )
            .Include(x => x.AppUser)
            .SingleOrDefaultAsync(cT);
    }
}