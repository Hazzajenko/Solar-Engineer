using dotnetapi.Data;
using dotnetapi.Features.Users.Data;
using dotnetapi.Features.Users.Mapping;
using dotnetapi.Models.Entities;
using Mediator;

namespace dotnetapi.Features.Users.Handlers;

public record CreateAppUserLinkCommand(AppUserLink AppUserLink) : IRequest<AppUserLinkDto>;

public class CreateAppUserLinkHandler : IRequestHandler<CreateAppUserLinkCommand, AppUserLinkDto>
{
    private readonly IDataContext _context;

    public CreateAppUserLinkHandler(IDataContext context)
    {
        _context = context;
    }

    public async ValueTask<AppUserLinkDto> Handle(
        CreateAppUserLinkCommand request,
        CancellationToken cT
    )
    {
        await _context.AppUserLinks.AddAsync(request.AppUserLink, cT);
        await _context.SaveChangesAsync(cT);
        return request.AppUserLink.ToDto();
    }
}