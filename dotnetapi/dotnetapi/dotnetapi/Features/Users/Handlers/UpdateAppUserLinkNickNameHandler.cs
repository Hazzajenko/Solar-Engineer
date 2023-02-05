using dotnetapi.Data;
using dotnetapi.Features.Users.Data;
using dotnetapi.Features.Users.Mapping;
using dotnetapi.Hubs;
using dotnetapi.Models.Entities;
using Mediator;
using Microsoft.AspNetCore.SignalR;

namespace dotnetapi.Features.Users.Handlers;

public record UpdateAppUserLinkNickNameCommand(
    AppUser AppUser,
    AppUser RecipientUser,
    string ToUpdateUserName,
    string NickName
) : IRequest<bool>;

public class UpdateAppUserLinkNickNameHandler
    : IRequestHandler<UpdateAppUserLinkNickNameCommand, bool>
{
    private readonly IDataContext _context;
    private readonly IHubContext<UsersHub, IUsersHub> _hubContext;
    private readonly IMediator _mediator;

    public UpdateAppUserLinkNickNameHandler(
        IDataContext context,
        IMediator mediator,
        IHubContext<UsersHub, IUsersHub> hubContext
    )
    {
        _context = context;
        _mediator = mediator;
        _hubContext = hubContext;
    }

    public async ValueTask<bool> Handle(
        UpdateAppUserLinkNickNameCommand request,
        CancellationToken cT
    )
    {
        var appUserLink = await _mediator.Send(
            new GetOrCreateAppUserLinkCommand(request.AppUser, request.RecipientUser),
            cT
        );

        if (request.ToUpdateUserName == appUserLink.AppUserReceivedUserName)
            appUserLink.AppUserReceivedNickName = request.NickName;

        if (request.ToUpdateUserName == appUserLink.AppUserRequestedUserName)
            appUserLink.AppUserRequestedNickName = request.NickName;

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