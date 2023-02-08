using dotnetapi.Data;
using dotnetapi.Models.Entities;
using Mediator;

namespace dotnetapi.Features.Auth.Handlers;

public sealed record CreateAppUserIdentityCommand(AppUserIdentity AppUserIdentity) : IRequest<bool>;

public class CreateAppUserIdentityHandler : IRequestHandler<CreateAppUserIdentityCommand, bool>
{
    private readonly IDataContext _context;

    public CreateAppUserIdentityHandler(IDataContext context)
    {
        _context = context;
    }

    public async ValueTask<bool> Handle(CreateAppUserIdentityCommand request, CancellationToken cT)
    {
        await _context.AppUserIdentities.AddAsync(request.AppUserIdentity, cT);
        await _context.SaveChangesAsync(cT);

        return await _context.SaveChangesAsync(cT) > 0;
    }
}