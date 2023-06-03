using Mediator;

namespace Identity.Application.Handlers.Images.CreateDpImage;

public record CreateDpImageCommand(string Initials) : ICommand<CreateDpImageResponse>;

public class CreateDpImageResponse
{
    public string ImageUrl { get; set; } = default!;
}