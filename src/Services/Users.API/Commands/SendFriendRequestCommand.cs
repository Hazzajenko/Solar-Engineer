using Mediator;
using Users.API.Entities;

namespace Users.API.Commands;

public sealed record SendFriendRequestCommand(HttpContext HttpContext)
    : IRequest<UserLink>;