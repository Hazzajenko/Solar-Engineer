using dotnetapi.Data;
using dotnetapi.Features.Users.Data;
using dotnetapi.Features.Users.Mapping;
using dotnetapi.Models.Entities;
using Mediator;
using Microsoft.EntityFrameworkCore;

namespace dotnetapi.Features.Users.Handlers.Friends;

public record GetAppUserLinkFriendsQuery(AppUser AppUser) : IRequest<IEnumerable<AppUserToUserDto>>;

public class GetAppUserLinkFriendsHandler
    : IRequestHandler<GetAppUserLinkFriendsQuery, IEnumerable<AppUserToUserDto>>
{
    private readonly IDataContext _context;

    public GetAppUserLinkFriendsHandler(IDataContext context)
    {
        _context = context;
    }

    public async ValueTask<IEnumerable<AppUserToUserDto>> Handle(
        GetAppUserLinkFriendsQuery request,
        CancellationToken cT
    )
    {
        return await _context.AppUserLinks
            .Where(
                x =>
                    (
                        x.AppUserRequestedUserName == request.AppUser.UserName
                        || x.AppUserReceivedUserName == request.AppUser.UserName
                    )
                    && x.Friends
                    && x.UserToUserStatus == UserToUserStatus.Approved
            )
            .Include(x => x.AppUserReceived)
            .Include(x => x.AppUserRequested)
            .Select(x => x.ToUserToUserDto(request.AppUser))
            .ToListAsync(cT);
    }
}