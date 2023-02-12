using Infrastructure.Entities.Identity;
using Mediator;
using Microsoft.AspNetCore.Identity;
using Users.API.Commands;
using Users.API.Entities;

namespace Users.API.Handlers;

public class SendFriendRequestHandler
    : IRequestHandler<SendFriendRequestCommand, UserLink>
{
    private readonly ILogger<SendFriendRequestHandler> _logger;
    private readonly UserManager<AppUser> _userManager;

    public SendFriendRequestHandler(UserManager<AppUser> userManager,
        ILogger<SendFriendRequestHandler> logger)
    {
        _userManager = userManager;
        _logger = logger;
    }

    public async ValueTask<UserLink> Handle(
        SendFriendRequestCommand request,
        CancellationToken cT
    )
    {
        return new UserLink();
    }
}