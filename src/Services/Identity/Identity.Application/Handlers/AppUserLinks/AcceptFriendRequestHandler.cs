using Identity.Application.Data.UnitOfWork;
using Identity.Domain;
using Mediator;
using Microsoft.Extensions.Logging;

namespace Identity.Application.Handlers.AppUserLinks;

public sealed record AcceptFriendRequestCommand(AppUserLink AppUserLink, AppUser User)
    : ICommand<bool>;

public class AcceptFriendRequestHandler
    : ICommandHandler<AcceptFriendRequestCommand, bool>
{
    private readonly ILogger<AcceptFriendRequestHandler> _logger;

    private readonly IIdentityUnitOfWork _unitOfWork;

    public AcceptFriendRequestHandler(ILogger<AcceptFriendRequestHandler> logger, IIdentityUnitOfWork unitOfWork)
    {
        _logger = logger;
        _unitOfWork = unitOfWork;
    }

    public async ValueTask<bool> Handle(
        AcceptFriendRequestCommand request,
        CancellationToken cT
    )
    {
        var userLink = request.AppUserLink;
        _unitOfWork.Attach(userLink);
        var isAppUserRequested = userLink.AppUserRequestedId == request.User.Id;
        if (isAppUserRequested)
        {
            userLink.AppUserRequestedStatusEvent = AppUserLink.FriendRequestSent.Accepted;
            userLink.AppUserReceivedStatusEvent = AppUserLink.FriendRequestReceived.Accepted;
        }
        else
        {
            userLink.AppUserRequestedStatusEvent = AppUserLink.FriendRequestReceived.Accepted;
            userLink.AppUserReceivedStatusEvent = AppUserLink.FriendRequestSent.Accepted;
        }

        return await _unitOfWork.SaveChangesAsync();
    }
}