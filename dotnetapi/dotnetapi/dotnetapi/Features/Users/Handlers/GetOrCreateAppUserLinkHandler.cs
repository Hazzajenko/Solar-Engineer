using dotnetapi.Data;
using dotnetapi.Models.Entities;
using Mediator;
using Microsoft.EntityFrameworkCore;

namespace dotnetapi.Features.Users.Handlers;

public record GetOrCreateAppUserLinkCommand(AppUser AppUser, AppUser Recipient) : IRequest<AppUserLink>;

public class
    GetOrCreateAppUserLinkHandler : IRequestHandler<GetOrCreateAppUserLinkCommand, AppUserLink>
{
    private readonly IDataContext _context;

    public GetOrCreateAppUserLinkHandler(IDataContext context)
    {
        _context = context;
    }

    public async ValueTask<AppUserLink>
        Handle(GetOrCreateAppUserLinkCommand request, CancellationToken cT)
    {
        var doesExist = await _context.AppUserLinks
            .Where(m => (m.AppUserRequestedUserName == request.AppUser.UserName
                         && m.AppUserReceivedUserName ==
                         request.Recipient.UserName)
                        || (m.AppUserRequestedUserName == request.Recipient.UserName
                            && m.AppUserReceivedUserName == request.AppUser.UserName)
            )
            .Include(x => x.AppUserReceived)
            .Include(x => x.AppUserRequested)
            .SingleOrDefaultAsync(cT);
        if (doesExist is not null) return doesExist;

        var appUserLink = new AppUserLink
        {
            AppUserRequested = request.AppUser,
            AppUserRequestedId = request.AppUser.Id,
            AppUserRequestedUserName = request.AppUser.UserName!,
            AppUserRequestedNickName = request.AppUser.UserName!,
            AppUserReceived = request.Recipient,
            AppUserReceivedId = request.Recipient.Id,
            AppUserReceivedUserName = request.Recipient.UserName!,
            AppUserReceivedNickName = request.Recipient.UserName!,
            Created = DateTime.Now,
            BecameFriendsTime = null,
            Friends = false,
            UserToUserStatus = UserToUserStatus.None
        };

        await _context.AppUserLinks.AddAsync(appUserLink, cT);
        await _context.SaveChangesAsync(cT);
        return appUserLink;
    }
}