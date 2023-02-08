using dotnetapi.Data;
using dotnetapi.Models.Entities;
using Mediator;

namespace dotnetapi.Features.Auth.Handlers;

public sealed record CreateAppUserCommand(AppUserIdentity AppUserIdentity) : IRequest<bool>;

public class CreateAppUserHandler : IRequestHandler<CreateAppUserCommand, bool>
{
    private readonly IDataContext _context;

    public CreateAppUserHandler(IDataContext context)
    {
        _context = context;
    }

    public async ValueTask<bool> Handle(CreateAppUserCommand request, CancellationToken cT)
    {
        // await _context.Users.AddAsync(request.AppUserIdentity, cT);
        await _context.SaveChangesAsync(cT);

        return await _context.SaveChangesAsync(cT) > 0;
    }
}