using dotnetapi.Data;
using dotnetapi.Models.Entities;
using Mediator;
using Microsoft.EntityFrameworkCore;

namespace dotnetapi.Features.Users.Handlers;

public record GetAppUserLinkQuery(AppUser AppUser, AppUser Recipient) : IRequest<AppUserLink?>;

public class
    GetAppUserLinkHandler : IRequestHandler<GetAppUserLinkQuery, AppUserLink?>
{
    private readonly IDataContext _context;

    public GetAppUserLinkHandler(IDataContext context)
    {
        _context = context;
    }

    public async ValueTask<AppUserLink?>
        Handle(GetAppUserLinkQuery request, CancellationToken cT)
    {
        return await _context.AppUserLinks
            .Where(m => (m.AppUserRequestedUserName == request.AppUser.UserName
                         && m.AppUserReceivedUserName ==
                         request.Recipient.UserName)
                        || (m.AppUserRequestedUserName == request.Recipient.UserName
                            && m.AppUserReceivedUserName == request.AppUser.UserName)
            )
            .Include(x => x.AppUserReceived)
            .Include(x => x.AppUserRequested)
            .SingleOrDefaultAsync(cT);
    }
}