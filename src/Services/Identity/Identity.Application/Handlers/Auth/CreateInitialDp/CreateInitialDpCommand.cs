using Identity.Contracts.Data;
using Identity.Domain;
using Mediator;
using Microsoft.AspNetCore.Http;

namespace Identity.Application.Handlers.Auth.CreateInitialDp;

public record CreateInitialDpCommand(AppUser AppUser) : IRequest<CreateInitialDpResponse>;

public class CreateInitialDpResponse
{
    public string PhotoUrl { get; set; } = default!;
}
