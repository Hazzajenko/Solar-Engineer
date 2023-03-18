using Mediator;
using Users.API.Contracts.Responses.Images;

namespace Users.API.Handlers.Images.CreateDpImage;

public record CreateDpImageCommand(string Initials) : ICommand<CreateDpImageResponse>;