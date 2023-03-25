using Mediator;

namespace Identity.Application.Handlers.Auth.Token;

public record GetTokenCommand(Guid AppUserId, string UserName) : ICommand<string>;