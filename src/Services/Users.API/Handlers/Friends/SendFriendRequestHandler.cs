using Mediator;
using Users.API.Data;
using Users.API.Entities;
using Users.API.Models;

namespace Users.API.Handlers.Friends;

public sealed record SendFriendRequestCommand(UserLink UserLink, User User)
    : ICommand<bool>;

public class SendFriendRequestHandler
    : ICommandHandler<SendFriendRequestCommand, bool>
{
    private readonly ILogger<SendFriendRequestHandler> _logger;
    private readonly IUsersUnitOfWork _unitOfWork;


    public SendFriendRequestHandler(ILogger<SendFriendRequestHandler> logger, IUsersUnitOfWork unitOfWork)
    {
        _logger = logger;
        _unitOfWork = unitOfWork;
    }

    public async ValueTask<bool> Handle(
        SendFriendRequestCommand request,
        CancellationToken cT
    )
    {
        var userLink = request.UserLink;
        _unitOfWork.Attach(userLink);
        var isAppUserRequested = userLink.AppUserRequestedId == request.User.Id;
        if (isAppUserRequested)
        {
            userLink.AppUserRequestedStatusEvent = UserStatus.FriendRequestSent.Pending;
            userLink.AppUserReceivedStatusEvent = UserStatus.FriendRequestReceived.Pending;
        }
        else
        {
            userLink.AppUserRequestedStatusEvent = UserStatus.FriendRequestReceived.Pending;
            userLink.AppUserReceivedStatusEvent = UserStatus.FriendRequestSent.Pending;
        }

        return await _unitOfWork.SaveChangesAsync();
    }
}