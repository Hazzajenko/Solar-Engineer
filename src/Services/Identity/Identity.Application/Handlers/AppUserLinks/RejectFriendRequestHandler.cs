using Identity.Application.Data.UnitOfWork;
using Identity.Domain;
using Mediator;
using Microsoft.Extensions.Logging;

namespace Identity.Application.Handlers.AppUserLinks;

public sealed record RejectFriendRequestCommand(AppUserLink AppUserLink, AppUser AppUser)
    : ICommand<bool>;

public class RejectFriendRequestHandler
    : ICommandHandler<RejectFriendRequestCommand, bool>
{
    private readonly ILogger<RejectFriendRequestHandler> _logger;

    private readonly IIdentityUnitOfWork _unitOfWork;

    public RejectFriendRequestHandler(ILogger<RejectFriendRequestHandler> logger, IIdentityUnitOfWork unitOfWork)
    {
        _logger = logger;
        _unitOfWork = unitOfWork;
    }

    public async ValueTask<bool> Handle(
        RejectFriendRequestCommand request,
        CancellationToken cT
    )
    {
        var userLink = request.AppUserLink;
        _unitOfWork.Attach(userLink);
        var isAppUserRequested = userLink.AppUserRequestedId == request.AppUser.Id;
        if (isAppUserRequested)
        {
            userLink.AppUserRequestedStatusEvent = AppUserLink.FriendRequestSent.Rejected;
            userLink.AppUserReceivedStatusEvent = AppUserLink.FriendRequestReceived.Rejected;
        }
        else
        {
            userLink.AppUserRequestedStatusEvent = AppUserLink.FriendRequestReceived.Rejected;
            userLink.AppUserReceivedStatusEvent = AppUserLink.FriendRequestSent.Rejected;
        }

        return await _unitOfWork.SaveChangesAsync();
    }
}