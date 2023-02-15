using Infrastructure.Entities.Identity;
using Mediator;
using Users.API.Data;
using Users.API.Entities;
using Users.API.Grpc;
using Users.API.Models;
using Users.API.Repositories;
// using AppUser = Users.API.Entities.AppUser;

namespace Users.API.Handlers;

public sealed record SendFriendRequestCommand(UserLink UserLink, AppUser AppUser)
    : ICommand<bool>;

public class SendFriendRequestHandler
    : ICommandHandler<SendFriendRequestCommand, bool>
{
    private readonly IAuthGrpcService _auth;
    private readonly ILogger<SendFriendRequestHandler> _logger;
    private readonly ITrackContext _trackContext;
    private readonly IUsersContext _unitOfWork;
    private readonly IUserLinksRepository _userLinksRepository;

    public SendFriendRequestHandler(ILogger<SendFriendRequestHandler> logger, IAuthGrpcService auth,
        IUserLinksRepository userLinksRepository, IUsersContext unitOfWork, ITrackContext trackContext)
    {
        _logger = logger;
        _auth = auth;
        _userLinksRepository = userLinksRepository;
        _unitOfWork = unitOfWork;
        _trackContext = trackContext;
    }

    public async ValueTask<bool> Handle(
        SendFriendRequestCommand request,
        CancellationToken cT
    )
    {
        var userLink = request.UserLink;
        _trackContext.Attach(userLink);
        var isAppUserRequested = userLink.AppUserRequestedId == request.AppUser.Id;
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

        return await _unitOfWork.SaveChangesAsync(cT) > 0;
    }
}