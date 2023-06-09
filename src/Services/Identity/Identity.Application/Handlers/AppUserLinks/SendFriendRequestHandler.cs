using Identity.Application.Data.UnitOfWork;
using Identity.Domain;
using Mediator;
using Microsoft.Extensions.Logging;

namespace Identity.Application.Handlers.AppUserLinks;

public sealed record SendFriendRequestCommand(AppUserLink AppUserLink, AppUser AppUser)
    : ICommand<bool>;

public class SendFriendRequestHandler
    : ICommandHandler<SendFriendRequestCommand, bool>
{
    private readonly ILogger<SendFriendRequestHandler> _logger;
    private readonly IIdentityUnitOfWork _unitOfWork;


    public SendFriendRequestHandler(ILogger<SendFriendRequestHandler> logger, IIdentityUnitOfWork unitOfWork)
    {
        _logger = logger;
        _unitOfWork = unitOfWork;
    }

    public async ValueTask<bool> Handle(
        SendFriendRequestCommand request,
        CancellationToken cT
    )
    {
        var userLink = request.AppUserLink;
        _unitOfWork.Attach(userLink);
        var isAppUserRequested = userLink.AppUserRequestedId == request.AppUser.Id;
        if (isAppUserRequested)
        {
            userLink.AppUserRequestedStatusEvent = AppUserLink.FriendRequestSent.Pending;
            userLink.AppUserReceivedStatusEvent = AppUserLink.FriendRequestReceived.Pending;
        }
        else
        {
            userLink.AppUserRequestedStatusEvent = AppUserLink.FriendRequestReceived.Pending;
            userLink.AppUserReceivedStatusEvent = AppUserLink.FriendRequestSent.Pending;
        }

        return await _unitOfWork.SaveChangesAsync();
    }
}