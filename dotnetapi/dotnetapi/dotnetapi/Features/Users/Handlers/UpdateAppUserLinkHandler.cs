using dotnetapi.Data;
using dotnetapi.Features.Users.Data;
using dotnetapi.Features.Users.Mapping;
using dotnetapi.Hubs;
using dotnetapi.Models.Entities;
using Mediator;
using Microsoft.AspNetCore.SignalR;

namespace dotnetapi.Features.Users.Handlers;

public record UpdateAppUserLinkCommand(
    AppUser AppUser,
    AppUser RecipientUser,
    AppUserLinkChanges Changes
) : IRequest<bool>;

public class UpdateAppUserLinkHandler : IRequestHandler<UpdateAppUserLinkCommand, bool>
{
    private readonly IDataContext _context;
    private readonly IHubContext<UsersHub, IUsersHub> _hubContext;
    private readonly IMediator _mediator;

    public UpdateAppUserLinkHandler(
        IDataContext context,
        IMediator mediator,
        IHubContext<UsersHub, IUsersHub> hubContext
    )
    {
        _context = context;
        _mediator = mediator;
        _hubContext = hubContext;
    }

    public async ValueTask<bool> Handle(UpdateAppUserLinkCommand request, CancellationToken cT)
    {
        var appUserLink = await _mediator.Send(
            new GetOrCreateAppUserLinkCommand(request.AppUser, request.RecipientUser),
            cT
        );

        var changes = request.Changes;

        if (changes.AppUserRequestedNickName is not null)
            appUserLink.AppUserRequestedNickName = changes.AppUserRequestedNickName;
        if (changes.AppUserReceivedNickName is not null)
            appUserLink.AppUserReceivedNickName = changes.AppUserReceivedNickName;
        if (changes.UserToUserStatus is not null)
            appUserLink.UserToUserStatus = (UserToUserStatus)changes.UserToUserStatus;
        if (changes.Friends is not null)
            appUserLink.Friends = (bool)changes.Friends;
        if (changes.BecameFriendsTime is not null)
            appUserLink.BecameFriendsTime = changes.BecameFriendsTime;

        var update = await _context.SaveChangesAsync(cT) > 0;
        if (!update)
            return update;

        var notification = new List<AppUserLinkDto> { appUserLink.ToDto() };

        await _hubContext.Clients
            .Users(request.AppUser.UserName!, request.RecipientUser.UserName!)
            .GetAppUserLinks(notification);

        return update;
    }
}