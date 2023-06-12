using Identity.Contracts.Responses.Friends;
using Infrastructure.Authentication;
using Mediator;

namespace Identity.SignalR.Commands.Friends;

public record GetUserFriendsCommand(AuthUser AuthUser) : ICommand<GetUserFriendsResponse>;
