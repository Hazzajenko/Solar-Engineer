using Infrastructure.Entities.Identity;
using Mediator;
using Users.API.Data;
using Users.API.Entities;
using Users.API.Models;
// using AppUser = Users.API.Entities.AppUser;

namespace Users.API.Handlers;

public sealed record RejectFriendRequestCommand(UserLink UserLink, AppUser AppUser)
    : ICommand<bool>;

public class RejectFriendRequestHandler
    : ICommandHandler<RejectFriendRequestCommand, bool>
{
    private readonly ILogger<RejectFriendRequestHandler> _logger;
    private readonly IUnitOfWork _unitOfWork;
    // private readonly ITrackContext _trackContext;
    // private readonly IUsersContext _unitOfWork;

    public RejectFriendRequestHandler(ILogger<RejectFriendRequestHandler> logger, IUnitOfWork unitOfWork)
    {
        _logger = logger;
        _unitOfWork = unitOfWork;
        // _trackContext = trackContext;
    }

    public async ValueTask<bool> Handle(
        RejectFriendRequestCommand request,
        CancellationToken cT
    )
    {
        var userLink = request.UserLink;
        _unitOfWork.Attach(userLink);
        var isAppUserRequested = userLink.AppUserRequestedId == request.AppUser.Id;
        if (isAppUserRequested)
        {
            userLink.AppUserRequestedStatusEvent = UserStatus.FriendRequestSent.Rejected;
            userLink.AppUserReceivedStatusEvent = UserStatus.FriendRequestReceived.Rejected;
        }
        else
        {
            userLink.AppUserRequestedStatusEvent = UserStatus.FriendRequestReceived.Rejected;
            userLink.AppUserReceivedStatusEvent = UserStatus.FriendRequestSent.Rejected;
        }

        return await _unitOfWork.Complete();
    }
}