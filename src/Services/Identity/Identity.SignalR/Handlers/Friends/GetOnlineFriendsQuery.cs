using Identity.Contracts.Responses.Friends;
using Infrastructure.Authentication;
using Mediator;

namespace Identity.SignalR.Handlers.Friends;

public record GetOnlineFriendsQuery(AuthUser AuthUser) : IQuery<GetOnlineFriendsResponse>;