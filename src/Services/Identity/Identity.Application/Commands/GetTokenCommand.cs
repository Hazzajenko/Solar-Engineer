using Mediator;

namespace Identity.Application.Commands;

public record GetTokenCommand(Guid AppUserId, string UserName) : ICommand<string>;