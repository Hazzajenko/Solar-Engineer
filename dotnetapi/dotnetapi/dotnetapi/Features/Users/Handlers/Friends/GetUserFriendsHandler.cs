using dotnetapi.Data;
using dotnetapi.Features.Users.Data;
using dotnetapi.Features.Users.Mapping;
using dotnetapi.Models.Entities;
using Mediator;
using Microsoft.EntityFrameworkCore;

namespace dotnetapi.Features.Users.Handlers.Friends;

public record GetUserFriendsQuery(AppUser AppUser) : IRequest<IEnumerable<RecipientUserFriendDto>>;

public class GetUserFriendsHandler
    : IRequestHandler<GetUserFriendsQuery, IEnumerable<RecipientUserFriendDto>>
{
    private readonly IDataContext _context;

    public GetUserFriendsHandler(IDataContext context)
    {
        _context = context;
    }

    public async ValueTask<IEnumerable<RecipientUserFriendDto>> Handle(
        GetUserFriendsQuery request,
        CancellationToken cT
    )
    {
        return await _context.AppUserLinks
            .Where(
                x =>
                (
                    x.AppUserRequestedUserName == request.AppUser.UserName
                    || x.AppUserReceivedUserName == request.AppUser.UserName
                ) && x.Friends
                // && x.UserToUserStatus == UserToUserStatus.Approved
            )
            .Include(x => x.AppUserReceived)
            .Include(x => x.AppUserRequested)
            .Select(x => x.ToRecipientFriendDto(request.AppUser))
            .ToListAsync(cT);
    }
}