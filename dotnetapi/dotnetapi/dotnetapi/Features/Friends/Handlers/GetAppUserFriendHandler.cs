using dotnetapi.Data;
using dotnetapi.Models.Entities;
using Mediator;
using Microsoft.EntityFrameworkCore;

namespace dotnetapi.Features.Friends.Handlers;

public sealed record GetAppUserFriendQuery
    (AppUser AppUser, AppUser FriendUser) : IRequest<AppUserFriend?>;

public class
    GetAppUserFriendHandler : IRequestHandler<GetAppUserFriendQuery, AppUserFriend?>
{
    private readonly IDataContext _context;

    public GetAppUserFriendHandler(IDataContext context)
    {
        _context = context;
    }

    public async ValueTask<AppUserFriend?>
        Handle(GetAppUserFriendQuery request, CancellationToken cT)
    {
        return await _context.AppUserFriends
            .Where(x =>
                (x.RequestedById == request.AppUser.Id || x.RequestedToId == request.AppUser.Id) &&
                (x.RequestedById == request.FriendUser.Id || x.RequestedToId == request.FriendUser.Id)
            )
            .SingleOrDefaultAsync(cT);
        // _context.SaveChangesAsync()
    }
}