using Identity.Domain;
using Infrastructure.Authentication;
using Mediator;

namespace Identity.SignalR.Commands.Friends;

public sealed record AcceptFriendRequestCommand(AuthUser AuthUser, string RecipientUserId)
    : ICommand<bool>;
