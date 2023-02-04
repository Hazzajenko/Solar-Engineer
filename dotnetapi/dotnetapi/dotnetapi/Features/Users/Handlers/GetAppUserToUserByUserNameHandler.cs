using dotnetapi.Data;
using dotnetapi.Exceptions;
using dotnetapi.Features.Users.Data;
using dotnetapi.Features.Users.Mapping;
using dotnetapi.Models.Entities;
using Mediator;
using Microsoft.EntityFrameworkCore;

namespace dotnetapi.Features.Users.Handlers;

public record GetAppUserToUserByUserNameQuery(AppUser AppUser, string RecipientUserName)
    : IRequest<AppUserToUserDto>;

public class GetAppUserToUserByUserNameHandler
    : IRequestHandler<GetAppUserToUserByUserNameQuery, AppUserToUserDto>
{
    private readonly IDataContext _context;

    public GetAppUserToUserByUserNameHandler(IDataContext context)
    {
        _context = context;
    }

    public async ValueTask<AppUserToUserDto> Handle(
        GetAppUserToUserByUserNameQuery request,
        CancellationToken cT
    )
    {
        var doesExist = await _context.AppUserLinks
            .Where(
                m =>
                    (
                        m.AppUserRequestedUserName == request.AppUser.UserName
                        && m.AppUserReceivedUserName == request.RecipientUserName
                    )
                    || (
                        m.AppUserRequestedUserName == request.RecipientUserName
                        && m.AppUserReceivedUserName == request.AppUser.UserName
                    )
            )
            .Include(x => x.AppUserReceived)
            .Include(x => x.AppUserRequested)
            .Select(x => x.ToUserToUserDto(request.AppUser))
            .SingleOrDefaultAsync(cT);
        if (doesExist is not null)
            return doesExist;

        var recipientUser = await _context.Users.SingleOrDefaultAsync(
            x => x.UserName == request.RecipientUserName,
            cT
        );

        if (recipientUser is null)
            throw new NotFoundException(nameof(AppUser), request.RecipientUserName);

        var appUserLink = new AppUserLink
        {
            AppUserRequested = request.AppUser,
            AppUserRequestedId = request.AppUser.Id,
            AppUserRequestedUserName = request.AppUser.UserName!,
            AppUserRequestedNickName = request.AppUser.UserName!,
            AppUserReceived = recipientUser,
            AppUserReceivedId = recipientUser.Id,
            AppUserReceivedUserName = recipientUser.UserName!,
            AppUserReceivedNickName = recipientUser.UserName!,
            Created = DateTime.Now,
            BecameFriendsTime = null,
            Friends = false,
            UserToUserStatus = UserToUserStatus.None
        };

        await _context.AppUserLinks.AddAsync(appUserLink, cT);
        await _context.SaveChangesAsync(cT);
        return appUserLink.ToUserToUserDto(request.AppUser);
    }
}