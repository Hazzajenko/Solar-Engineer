using dotnetapi.Data;
using dotnetapi.Features.Users.Data;
using dotnetapi.Features.Users.Mapping;
using dotnetapi.Hubs;
using dotnetapi.Models.Entities;
using Mediator;
using Microsoft.AspNetCore.SignalR;

namespace dotnetapi.Features.Users.Handlers;

public record UpdateAppUserLinkStatusCommand(
    AppUser AppUser,
    AppUser RecipientUser,
    UserToUserStatus Status
) : IRequest<bool>;

public class UpdateAppUserLinkStatusHandler : IRequestHandler<UpdateAppUserLinkStatusCommand, bool>
{
    private readonly IDataContext _context;
    private readonly IHubContext<NotificationsHub, INotificationsHub> _hubContext;
    private readonly IMediator _mediator;

    public UpdateAppUserLinkStatusHandler(
        IDataContext context,
        IMediator mediator,
        IHubContext<NotificationsHub, INotificationsHub> hubContext
    )
    {
        _context = context;
        _mediator = mediator;
        _hubContext = hubContext;
    }

    public async ValueTask<bool> Handle(UpdateAppUserLinkStatusCommand request, CancellationToken cT)
    {
        var appUserLink = await _mediator.Send(
            new GetOrCreateAppUserLinkCommand(request.AppUser, request.RecipientUser),
            cT
        );

        if (request.Status == UserToUserStatus.Pending) appUserLink.UserToUserStatus = UserToUserStatus.Pending;

        if (request.Status == UserToUserStatus.Approved)
        {
            appUserLink.UserToUserStatus = UserToUserStatus.Approved;
            appUserLink.BecameFriendsTime = DateTime.Now;
            appUserLink.Friends = true;
        }

        if (request.Status == UserToUserStatus.Rejected) appUserLink.UserToUserStatus = UserToUserStatus.Rejected;


        var update = await _context.SaveChangesAsync(cT) > 0;
        if (!update) return update;

        var notification = new List<AppUserLinkDto> { appUserLink.ToDto() };

        await _hubContext.Clients
            .Users(request.AppUser.UserName!, request.RecipientUser.UserName!)
            .GetAppUserLinks(notification);

        return update;
    }
}