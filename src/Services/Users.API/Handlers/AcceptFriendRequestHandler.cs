using Infrastructure.Entities.Identity;
using Mediator;
using Users.API.Data;
using Users.API.Entities;
using Users.API.Models;
// using AppUser = Users.API.Entities.AppUser;

namespace Users.API.Handlers;

public sealed record AcceptFriendRequestCommand(UserLink UserLink, AppUser AppUser)
    : ICommand<bool>;

public class AcceptFriendRequestHandler
    : ICommandHandler<AcceptFriendRequestCommand, bool>
{
    private readonly ILogger<AcceptFriendRequestHandler> _logger;
    // private readonly ITrackContext _trackContext;
    // private readonly IUsersContext _unitOfWork;
    private readonly IUnitOfWork _unitOfWork;

    public AcceptFriendRequestHandler(ILogger<AcceptFriendRequestHandler> logger, IUnitOfWork unitOfWork)
    {
        _logger = logger;
        _unitOfWork = unitOfWork;
        // _unitOfWork = unitOfWork;
        // _trackContext = trackContext;
    }

    public async ValueTask<bool> Handle(
        AcceptFriendRequestCommand request,
        CancellationToken cT
    )
    {
        var userLink = request.UserLink;
        _unitOfWork.Attach(userLink);
        var isAppUserRequested = userLink.AppUserRequestedId == request.AppUser.Id;
        if (isAppUserRequested)
        {
            userLink.AppUserRequestedStatusEvent = UserStatus.FriendRequestSent.Accepted;
            userLink.AppUserReceivedStatusEvent = UserStatus.FriendRequestReceived.Accepted;
        }
        else
        {
            userLink.AppUserRequestedStatusEvent = UserStatus.FriendRequestReceived.Accepted;
            userLink.AppUserReceivedStatusEvent = UserStatus.FriendRequestSent.Accepted;
        }

        return await _unitOfWork.Complete();
    }
}