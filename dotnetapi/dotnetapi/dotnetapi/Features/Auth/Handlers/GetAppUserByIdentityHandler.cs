using dotnetapi.Data;
using dotnetapi.Extensions;
using dotnetapi.Models.Entities;
using Mediator;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace dotnetapi.Features.Auth.Handlers;

public sealed record GetAppUserByIdentityQuery(ProviderQuery ProviderQuery) : IRequest<AppUser?>;

public class GetAppUserByIdentityHandler : IRequestHandler<GetAppUserByIdentityQuery, AppUser?>
{
    private readonly IDataContext _context;
    private readonly UserManager<AppUser> _userManager;

    public GetAppUserByIdentityHandler(IDataContext context, UserManager<AppUser> userManager)
    {
        _context = context;
        _userManager = userManager;
    }

    public async ValueTask<AppUser?> Handle(GetAppUserByIdentityQuery request, CancellationToken cT)
    {
        // var appUserIdentity2 = await _userManager.FindByLoginAsync();
        var appUserIdentity = await _context.AppUserIdentities
            .Where(
                x =>
                    x.LoginProvider == request.ProviderQuery.LoginProvider
                    && x.ProviderKey == request.ProviderQuery.ProviderKey
            )
            .Include(x => x.AppUser)
            .SingleOrDefaultAsync(cT);
        return appUserIdentity?.AppUser;
    }
}