using Mediator;
using Users.API.Data;
using Users.API.Entities;
using Users.API.Models;

namespace Users.API.Handlers.Friends;

public sealed record AcceptFriendRequestCommand(UserLink UserLink, User User) : ICommand<bool>;

public class AcceptFriendRequestHandler : ICommandHandler<AcceptFriendRequestCommand, bool>
{
    private readonly ILogger<AcceptFriendRequestHandler> _logger;

    private readonly IUsersUnitOfWork _unitOfWork;

    public AcceptFriendRequestHandler(
        ILogger<AcceptFriendRequestHandler> logger,
        IUsersUnitOfWork unitOfWork
    )
    {
        _logger = logger;
        _unitOfWork = unitOfWork;
    }

    public async ValueTask<bool> Handle(AcceptFriendRequestCommand request, CancellationToken cT)
    {
        /*var userLink = request.UserLink;
        _unitOfWork.Attach(userLink);
        var isAppUserRequested = userLink.AppUserRequestedId == request.User.Id;
        if (isAppUserRequested)
        {
            userLink.AppUserRequestedStatusEvent = UserStatus.FriendRequestSent.Accepted;
            userLink.AppUserReceivedStatusEvent = UserStatus.FriendRequestReceived.Accepted;
        }
        else
        {
            userLink.AppUserRequestedStatusEvent = UserStatus.FriendRequestReceived.Accepted;
            userLink.AppUserReceivedStatusEvent = UserStatus.FriendRequestSent.Accepted;
        }*/

        return await _unitOfWork.SaveChangesAsync();
    }
}
