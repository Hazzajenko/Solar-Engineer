using Mediator;

namespace Auth.API.Commands;


public sealed record GetUserCommand(string Subject)
    : IQuery<Auth0UserDto?>;