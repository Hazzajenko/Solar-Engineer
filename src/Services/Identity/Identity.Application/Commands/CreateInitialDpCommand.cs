using Identity.Domain;
using Mediator;

namespace Identity.Application.Commands;

public record CreateInitialDpCommand(AppUser AppUser) : IRequest<CreateInitialDpResponse>;

public class CreateInitialDpResponse
{
    public string PhotoUrl { get; set; } = default!;
}
