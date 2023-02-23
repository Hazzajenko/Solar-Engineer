// using Infrastructure.Entities.Identity;

using Mediator;
using Users.API.Data;
using Users.API.Entities;
using Users.API.Models;

// using AppUser = Users.API.Entities.AppUser;

namespace Users.API.Handlers.Friends;

public sealed record RejectFriendRequestCommand(UserLink UserLink, User User)
    : ICommand<bool>;

public class RejectFriendRequestHandler
    : ICommandHandler<RejectFriendRequestCommand, bool>
{
    private readonly ILogger<RejectFriendRequestHandler> _logger;

    private readonly IUsersUnitOfWork _unitOfWork;

    public RejectFriendRequestHandler(ILogger<RejectFriendRequestHandler> logger, IUsersUnitOfWork unitOfWork)
    {
        _logger = logger;
        _unitOfWork = unitOfWork;
    }

    public async ValueTask<bool> Handle(
        RejectFriendRequestCommand request,
        CancellationToken cT
    )
    {
        var userLink = request.UserLink;
        _unitOfWork.Attach(userLink);
        var isAppUserRequested = userLink.AppUserRequestedId == request.User.Id;
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

        return await _unitOfWork.SaveChangesAsync();
    }
}