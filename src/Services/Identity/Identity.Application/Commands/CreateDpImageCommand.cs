using Mediator;

namespace Identity.Application.Commands;

public record CreateDpImageCommand(string Initials) : ICommand<CreateDpImageResponse>;

public class CreateDpImageResponse
{
    public string ImageUrl { get; set; } = default!;
}