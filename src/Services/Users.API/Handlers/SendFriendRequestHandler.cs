// using Infrastructure.Entities.Identity;

using Mediator;
using Users.API.Data;
using Users.API.Entities;
using Users.API.Models;

// using IUnitOfWork = DotNetCore.EntityFrameworkCore.IUnitOfWork;

// using AppUser = Users.API.Entities.AppUser;

namespace Users.API.Handlers;

public sealed record SendFriendRequestCommand(UserLink UserLink, User User)
    : ICommand<bool>;

public class SendFriendRequestHandler
    : ICommandHandler<SendFriendRequestCommand, bool>
{
    // private readonly IAuthGrpcService _auth;
    private readonly ILogger<SendFriendRequestHandler> _logger;

    private readonly IUsersUnitOfWork _unitOfWork;
    // private readonly IUsersContext _unitOfWork;
    // private readonly IUserLinksRepository _userLinksRepository;

    public SendFriendRequestHandler(ILogger<SendFriendRequestHandler> logger, IUsersUnitOfWork unitOfWork)
    {
        _logger = logger;
        _unitOfWork = unitOfWork;
        // _auth = auth;
        // _userLinksRepository = userLinksRepository;
        // _unitOfWork = unitOfWork;
        // _trackContext = trackContext;
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